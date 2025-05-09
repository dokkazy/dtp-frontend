import { create } from "zustand";
import { toast } from "sonner";

import { OrderResponse, OrderStatus } from "@/types/order";
import { orderApiRequest } from "@/apiRequests/order";
import { HttpError } from "@/lib/http";

const ORDERS_PER_PAGE = 5;

interface OrderState {
  orders: OrderResponse[];
  displayedOrders: OrderResponse[];
  loading: boolean;
  currentPage: number;
  hasMore: boolean;
  fetchOrders: (isFilter?: boolean) => Promise<void>;
  loadMore: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  displayedOrders: [],
  loading: false,
  currentPage: 1,
  hasMore: false,

  fetchOrders: async (isFilter = false) => {
    set({ loading: true });
    try {
      const response = await orderApiRequest.getOrders();
      if (response.status === 200) {
        const allOrders = response.payload;
        const validOrders = allOrders.filter(
          (order: OrderResponse) =>
            order.status == OrderStatus.COMPLETED && order.canRating == true,
        );

        const initialOrders = isFilter ? validOrders.slice(0, ORDERS_PER_PAGE) : allOrders.slice(0, ORDERS_PER_PAGE);
        set({
          orders: isFilter ? validOrders : allOrders,
          displayedOrders: initialOrders,
          hasMore: (isFilter ? validOrders.length : allOrders.length) > ORDERS_PER_PAGE,
          currentPage: 1,
          loading: false,
        });
      }
    } catch (error) {
      if (error instanceof HttpError) {
        console.log("Error fetching orders:", error);
      } else {
        toast.error("Đã có lỗi xảy ra trong quá trình tải đơn hàng.");
      }
      set({ loading: false });
    }
  },

  loadMore: () => {
    const { orders, currentPage } = get();
    const nextPage = currentPage + 1;
    const nextBatch = orders.slice(0, nextPage * ORDERS_PER_PAGE);
    set({
      displayedOrders: nextBatch,
      currentPage: nextPage,
      hasMore: nextBatch.length < orders.length,
    });
  },
}));
