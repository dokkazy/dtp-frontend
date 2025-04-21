import { createStore } from "zustand/vanilla";
import { createJSONStorage, persist } from "zustand/middleware";
import { TicketSchedule, TourDetail } from "@/types/tours";
import { isDateInPast } from "@/lib/client/utils";
import { PaymentStatus } from "@/types/checkout";

interface CartItem {
  tour: TourDetail;
  tourScheduleId: string;
  day: string;
  tickets: {
    ticketTypeId: string;
    ticketKind: number;
    netCost: number;
    quantity: number;
    availableTicket: number;
  }[];
  totalPrice: number;
}

type CartState = {
  cart: CartItem[];
  selectedItems: string[];
  selectAll: boolean;
  paymentItem: CartItem | null;
  directCheckoutItem: CartItem | null;
};

type CartActions = {
  setCartState: (state: CartState) => void;
  addToCart: (
    tour: TourDetail,
    tourScheduleId: string,
    day: string,
    tickets: TicketSchedule[],
    quantities: { [ticketId: string]: number },
  ) => void;
  clearCart: () => void;
  removeFromCart: (tourScheduleId: string) => void;
  updateQuantity: (
    tourScheduleId: string,
    ticketTypeId: string,
    action: "increase" | "decrease",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => any;
  removeTicket: (tourScheduleId: string, ticketTypeId: string) => void;
  selectItem: (itemId: string, checked: boolean) => void;
  removeSelectedItems: () => void;
  selectForPayment: (itemId: string) => void;
  removePaymentItem: (cancel?: boolean, paymentStatus?: PaymentStatus) => void;
  toggleSelectAll: (checked: boolean) => void;

  getItemById: (tourScheduleId: string) => CartItem | undefined;
  getCartTotal: () => number;
  getCartCount: () => number;
  setQuantityDirectly: (
    tourScheduleId: string,
    ticketTypeId: string,
    quantity: number,
  ) => void;
  setDirectCheckoutItem: (
    tour: TourDetail,
    tourScheduleId: string,
    day: string,
    tickets: TicketSchedule[],
    quantities: { [ticketId: string]: number },
  ) => void;
  clearDirectCheckoutItem: () => void;
};

export type CartStoreType = CartState & CartActions;

const SESSION_TIMEOUT_DURATION = 7200 * 60 * 1000; // 30 minutes

let sessionTimeout: NodeJS.Timeout;

const initialState = {
  cart: [],
  selectedItems: [],
  selectAll: false,
  paymentItem: null,
  directCheckoutItem: null,
};

export const createCartStore = (initState = initialState) => {
  return createStore<CartStoreType>()(
    persist(
      (set, get) => ({
        ...initState,
        setCartState: (newState) => {
          set({
            cart: newState.cart || [],
            selectedItems: newState.selectedItems || [],
            selectAll: newState.selectAll || false,
            paymentItem: newState.paymentItem || null,
            directCheckoutItem: newState.directCheckoutItem || null,
          });
        },
        addToCart: (tour, tourScheduleId, day, tickets, quantities) => {
          const { cart } = get();

          // Prepare ticket data with quantities
          const ticketsWithQuantity = tickets
            .filter((ticket) => quantities[ticket.ticketTypeId] > 0)
            .map((ticket) => ({
              ticketTypeId: ticket.ticketTypeId,
              ticketKind: ticket.ticketKind,
              netCost: ticket.netCost,
              quantity: quantities[ticket.ticketTypeId],
              availableTicket: ticket.availableTicket,
            }));

          // Calculate total price
          const totalPrice = ticketsWithQuantity.reduce(
            (sum, ticket) => sum + ticket.netCost * ticket.quantity,
            0,
          );

          // Create new cart item
          const newItem: CartItem = {
            tour,
            tourScheduleId,
            day,
            tickets: ticketsWithQuantity,
            totalPrice,
          };

          // Check if this tour schedule already exists in cart
          const existingItemIndex = cart.findIndex(
            (item) => item.tourScheduleId === tourScheduleId,
          );

          if (existingItemIndex >= 0) {
            // Replace existing item
            const updatedCart = [...cart];
            updatedCart[existingItemIndex] = newItem;
            set({ cart: updatedCart });
          } else {
            // Add new item
            console.log("Adding new item to cart:", newItem);
            set({ cart: [...cart, newItem] });
          }

          resetSessionTimeout();
        },
        clearCart: () => {
          set({ cart: [] });
          resetSessionTimeout();
        },

        removeFromCart: (tourScheduleId) => {
          const { cart, paymentItem } = get();

          const updatedCart = cart.filter(
            (item) => item.tourScheduleId !== tourScheduleId,
          );
          const updatedPaymentItem =
            paymentItem && paymentItem.tourScheduleId ? null : paymentItem;
          set({
            cart: updatedCart,
            paymentItem: updatedPaymentItem,
          });
          resetSessionTimeout();
        },
        updateQuantity: (tourScheduleId, ticketTypeId, action) => {
          const { cart, paymentItem } = get();

          // Find the cart item
          const updatedCart = [...cart];
          const itemIndex = updatedCart.findIndex(
            (item) => item.tourScheduleId === tourScheduleId,
          );

          if (itemIndex === -1) return; // Item not found

          // Find the specific ticket
          const item = updatedCart[itemIndex];
          const ticketIndex = item.tickets.findIndex(
            (ticket) => ticket.ticketTypeId === ticketTypeId,
          );
          if (ticketIndex === -1) return; // Ticket not found

          // Update the quantity
          const ticket = item.tickets[ticketIndex];
          const currentQuantity = ticket.quantity;

          if (action === "decrease" && currentQuantity <= 1) {
            return {
              needConfirmation: true,
              isLastTicket: item.tickets.length === 1,
              tourTitle: item.tour.tour.title,
              ticketType: ticket.ticketKind,
              tourScheduleId,
              ticketTypeId,
            };
          }
          if (action === "increase") {
            if (currentQuantity >= ticket.availableTicket) {
              return {
                isExceeded: true,
              };
            }
          }
          // Update the quantity
          const newQuantity =
            action === "increase" ? currentQuantity + 1 : currentQuantity - 1;
          item.tickets[ticketIndex] = {
            ...ticket,
            quantity: newQuantity,
          };

          // Recalculate the total price for the item
          item.totalPrice = item.tickets.reduce(
            (sum, ticket) => sum + ticket.netCost * ticket.quantity,
            0,
          );
          //check if cart item updated is the same as payment item
          if (paymentItem && paymentItem.tourScheduleId === tourScheduleId) {
            set({
              cart: updatedCart,
              paymentItem: updatedCart[itemIndex],
            });
          } else {
            // Only update the cart
            set({ cart: updatedCart });
          }

          resetSessionTimeout();
          return false;
        },
        removeTicket(tourScheduleId, ticketTypeId) {
          const { cart } = get();

          const updatedCart = [...cart];
          const itemIndex = updatedCart.findIndex(
            (item) => item.tourScheduleId === tourScheduleId,
          );
          if (itemIndex === -1) return; // Item not found

          const item = updatedCart[itemIndex];
          const ticketIndex = item.tickets.findIndex(
            (ticket) => ticket.ticketTypeId === ticketTypeId,
          );
          if (ticketIndex === -1) return; // Ticket not found

          if (item.tickets.length === 1) {
            // If it's the only ticket type, remove the entire item
            set({
              cart: cart.filter(
                (item) => item.tourScheduleId !== tourScheduleId,
              ),
            });
          } else {
            // Remove just this ticket type
            item.tickets.splice(ticketIndex, 1);

            // Recalculate total price
            item.totalPrice = item.tickets.reduce(
              (sum, ticket) => sum + ticket.netCost * ticket.quantity,
              0,
            );
            set({ cart: updatedCart });
          }

          resetSessionTimeout();
        },
        selectItem: (itemId, checked) => {
          set((state) => {
            let newSelectedItems;
            if (checked) {
              newSelectedItems = [...state.selectedItems, itemId];
            } else {
              newSelectedItems = state.selectedItems.filter(
                (id) => id !== itemId,
              );
            }
            // Update selectAll state
            const selectAll =
              state.cart.length > 0 &&
              newSelectedItems.length === state.cart.length;
            return {
              selectedItems: newSelectedItems,
              selectAll,
            };
          });
        },
        removeSelectedItems: () => {
          set((state) => {
            if (state.selectedItems.length === 0) return state;
            const updatedItems = state.cart.filter(
              (item) => !state.selectedItems.includes(item.tourScheduleId),
            );
            // Clear payment item if it was among the removed items
            const updatedPaymentItem =
              state.paymentItem &&
              state.selectedItems.includes(state.paymentItem.tourScheduleId)
                ? null
                : state.paymentItem;
            return {
              cart: updatedItems,
              selectedItems: [],
              paymentItem: updatedPaymentItem,
              selectAll: false,
            };
          });
        },

        selectForPayment: (itemId) => {
          const { cart } = get();
          const item = cart.find((item) => item.tourScheduleId === itemId);

          // Check if the item's date is in the past
          if (item && isDateInPast(item.day)) {
            // Don't allow selecting expired items
            return;
          }

          set({
            paymentItem: item,
            directCheckoutItem: null,
          });
        },
        removePaymentItem: (cancel, paymentStatus) => {
          const { cart, paymentItem } = get();
          if (cancel && paymentItem) {
            const updatedCart = cart.filter(
              (item) => item.tourScheduleId !== paymentItem.tourScheduleId,
            );
            set({
              cart: updatedCart,
            });
          }
          if (!cancel && paymentItem && paymentStatus === PaymentStatus.PAID) {
            const updatedCart = cart.filter(
              (item) => item.tourScheduleId !== paymentItem.tourScheduleId,
            );
            set({
              cart: updatedCart,
            });
            return;
          }

          set({
            paymentItem: null,
          });
        },
        toggleSelectAll: (checked) => {
          set((state) => {
            if (checked) {
              return {
                selectedItems: state.cart.map((item) => item.tourScheduleId),
                selectAll: true,
              };
            } else {
              return {
                selectedItems: [],
                selectAll: false,
              };
            }
          });
        },
        getItemById: (tourScheduleId) => {
          const { cart } = get();
          return cart.find((item) => item.tourScheduleId === tourScheduleId);
        },
        getCartTotal: () => {
          const { cart } = get();
          return cart.reduce((total, item) => total + item.totalPrice, 0);
        },

        getCartCount: () => {
          const { cart } = get();
          return cart.length;
        },
        setQuantityDirectly: (tourScheduleId, ticketTypeId, quantity) => {
          const { cart, paymentItem } = get();

          // Tìm item trong giỏ hàng
          const updatedCart = [...cart];
          const itemIndex = updatedCart.findIndex(
            (item) => item.tourScheduleId === tourScheduleId,
          );

          if (itemIndex === -1) return;

          // Tìm ticket cụ thể
          const item = updatedCart[itemIndex];
          const ticketIndex = item.tickets.findIndex(
            (ticket) => ticket.ticketTypeId === ticketTypeId,
          );

          if (ticketIndex === -1) return;

          const ticket = item.tickets[ticketIndex];

          // Kiểm tra giá trị nhập vào
          const safeQuantity = Math.max(1, quantity); // Tối thiểu là 1
          const isExceeded = safeQuantity > ticket.availableTicket;

          // Giới hạn số lượng không vượt quá vé có sẵn
          const finalQuantity = isExceeded
            ? ticket.availableTicket
            : safeQuantity;

          // Hiển thị thông báo nếu vượt quá
          if (isExceeded) {
            if (typeof window !== "undefined") {
              import("sonner").then((module) => {
                module.toast.error(
                  `Số lượng vé không được vượt quá số lượng tối đa cho phép.`,
                );
              });
            }
          }

          // Cập nhật số lượng
          item.tickets[ticketIndex] = {
            ...ticket,
            quantity: finalQuantity,
          };

          // Tính lại tổng giá
          item.totalPrice = item.tickets.reduce(
            (sum, ticket) => sum + ticket.netCost * ticket.quantity,
            0,
          );

          // Cập nhật cart và payment item nếu cần
          if (paymentItem && paymentItem.tourScheduleId === tourScheduleId) {
            set({
              cart: updatedCart,
              paymentItem: updatedCart[itemIndex],
            });
          } else {
            set({ cart: updatedCart });
          }

          resetSessionTimeout();
        },
        setDirectCheckoutItem: (
          tour: TourDetail,
          tourScheduleId: string,
          day: string,
          tickets: TicketSchedule[],
          quantities: { [ticketId: string]: number },
        ) => {
          // Only prepare tickets with quantity > 0
          const ticketsWithQuantity = tickets
            .filter((ticket) => quantities[ticket.ticketTypeId] > 0)
            .map((ticket) => ({
              ticketTypeId: ticket.ticketTypeId,
              ticketKind: ticket.ticketKind,
              netCost: ticket.netCost,
              quantity: quantities[ticket.ticketTypeId],
              availableTicket: ticket.availableTicket,
            }));

          // Calculate total price
          const totalPrice = ticketsWithQuantity.reduce(
            (sum, ticket) => sum + ticket.netCost * ticket.quantity,
            0,
          );

          // Create temporary payment item (not added to cart)
          const directCheckoutItem: CartItem = {
            tour,
            tourScheduleId,
            day,
            tickets: ticketsWithQuantity,
            totalPrice,
          };
          console.log("Setting direct checkout item:", directCheckoutItem);

          set({
            directCheckoutItem,
            paymentItem: null,
            // Don't modify the cart array
          });
        },
        clearDirectCheckoutItem: () => set({ directCheckoutItem: null }),
      }),
      {
        name: "cart-store",
        storage: createJSONStorage(() => localStorage),
        // partialize: (state) => ({
        //   cart: state.cart,
        //   selectedItems: state.selectedItems,
        //   selectAll: state.selectAll,
        //   paymentItem: state.paymentItem,
        //   // Omit directPaymentItem so it's not stored in localStorage
        // }),
        onRehydrateStorage: () => {
          resetSessionTimeout();
        },
      },
    ),
  );
};

function resetSessionTimeout() {
  clearTimeout(sessionTimeout);
  sessionTimeout = setTimeout(() => {
    localStorage.removeItem("cart-store");
  }, SESSION_TIMEOUT_DURATION);
}
