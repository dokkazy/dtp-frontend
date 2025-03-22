import { DailyTicketSchedule } from "@/types/tours";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type TourDetailServiceState = {
  showPackage: boolean;
  calendarOpen: boolean;
  date: Date | undefined;
  ticketSchedule: DailyTicketSchedule[];
  selectedDayTickets: any[];
  ticketQuantities: { [key: string]: number };
  totalPrice: number;
};

type TourDetailServiceActions = {
  setShowPackage: (show: boolean) => void;
  setCalendarOpen: (open: boolean) => void;
  setDate: (date: Date | undefined) => void;
  setTicketSchedule: (schedule: DailyTicketSchedule[] | []) => void;
  handleDateSelect: (selectedDate: Date | undefined) => void;
  handleConfirmDateSelection: () => void;
  handleQuantityChange: (
    ticketId: string,
    netCost: number,
    increment: boolean,
  ) => void;
  clearAll: () => void;
  togglePackage: () => void;
};

export type CartStoreType = TourDetailServiceState & TourDetailServiceActions;

const initialState: TourDetailServiceState = {
  showPackage: false,
  calendarOpen: false,
  date: undefined,
  ticketSchedule: [],
  selectedDayTickets: [],
  ticketQuantities: {},
  totalPrice: 0,
};

const useServiceSectionStore = create<CartStoreType>()(
  devtools(
    (set, get) => ({
      // Initial states
      ...initialState,

      // Actions
      setShowPackage: (show: boolean) =>
        set({ showPackage: show }, false, "setShowPackage"),

      setCalendarOpen: (open: boolean) =>
        set({ calendarOpen: open }, false, "setCalendarOpen"),

      setDate: (date: Date | undefined) => set({ date }, false, "setDate"),

      setTicketSchedule: (schedule: DailyTicketSchedule[]) =>
        set({ ticketSchedule: schedule }, false, "setTicketSchedule"),

      handleDateSelect: (selectedDate) => {
        set({ date: selectedDate }, false, "handleDateSelect/setDate");

        if (!selectedDate) {
          set({ showPackage: false }, false, "handleDateSelect/hidePackage");
          return;
        }

        const { ticketSchedule } = get();
        const selectedDayData = ticketSchedule.find(
          (day) =>
            new Date(day.day).toDateString() === selectedDate.toDateString(),
        );

        if (selectedDayData) {
          const initialQuantities: { [key: string]: number } = {};
          selectedDayData.ticketSchedules.forEach((ticket) => {
            initialQuantities[ticket.ticketTypeId] = 0;
          });

          set(
            {
              selectedDayTickets: selectedDayData.ticketSchedules,
              ticketQuantities: initialQuantities,
              totalPrice: 0,
            },
            false,
            "handleDateSelect/setSelectedDayData",
          );
        } else {
          set(
            {
              selectedDayTickets: [],
              ticketQuantities: {},
              totalPrice: 0,
            },
            false,
            "handleDateSelect/clearSelectedDayData",
          );
        }
      },

      handleConfirmDateSelection: () => {
        const { date, handleDateSelect } = get();
        handleDateSelect(date);
        set(
          { showPackage: true, calendarOpen: false },
          false,
          "handleConfirmDateSelection",
        );
      },

      handleQuantityChange: (ticketId, netCost, increment) => {
        const { ticketQuantities, totalPrice, selectedDayTickets } = get();

        const currentQuantity = ticketQuantities[ticketId] || 0;
        const availableTicket =
          selectedDayTickets.find((ticket) => ticket.ticketTypeId === ticketId)
            ?.availableTicket || 0;

        let newQuantity: number;
        if (increment) {
          newQuantity =
            currentQuantity < availableTicket
              ? currentQuantity + 1
              : currentQuantity;
        } else {
          newQuantity = Math.max(0, currentQuantity - 1);
        }

        const priceDifference = increment ? netCost : -netCost;
        const newTotalPrice = totalPrice + priceDifference;

        set(
          {
            ticketQuantities: { ...ticketQuantities, [ticketId]: newQuantity },
            totalPrice: newTotalPrice,
          },
          false,
          `handleQuantityChange/${increment ? "increment" : "decrement"}`,
        );
      },

      clearAll: () => {
        set(
          {
            date: undefined,
            selectedDayTickets: [],
            ticketQuantities: {},
            totalPrice: 0,
            showPackage: false,
          },
          false,
          "clearAll",
        );
      },

      togglePackage: () => {
        const { showPackage } = get();
        set({ showPackage: !showPackage }, false, "togglePackage");
      },
    }),
    {
      name: "Tour Detail Service Store",
      enabled: process.env.NODE_ENV !== "production",
    },
  ),
);

export default useServiceSectionStore;
