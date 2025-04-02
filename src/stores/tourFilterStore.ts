import { isProduction } from "@/lib/utils";
import { Tour, TourSortBy } from "@/types/tours";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type FilterType = {
  tours: Tour[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  priceRange: [number, number];
  maxPossiblePrice: number;
  isPriceFilterActive: boolean;
  selectedDate: Date | undefined;
  isDateFilterActive: boolean;
  sortBy: string;
};

type FilterActions = {
  setTours: (tours: Tour[], totalItem?: number) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setPriceRange: (range: [number, number]) => void;
  setIsPriceFilterActive: (active: boolean) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setIsDateFilterActive: (active: boolean) => void;
  setSortBy: (sortBy: string) => void;
  resetAllFilters: () => void;
};

export type TourFilterStoreType = FilterType & FilterActions;

const initialState: FilterType = {
  tours: [],
  currentPage: 1,
  pageSize: 9,
  totalItems: 0,
  totalPages: 1,
  priceRange: [0, 1000],
  maxPossiblePrice: 1000,
  isPriceFilterActive: false,
  selectedDate: undefined,
  isDateFilterActive: false,
  sortBy: TourSortBy.Recommended,
};

const useTourFilterStore = create<TourFilterStoreType>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setTours: (tours: Tour[], totalItems?: number) => {
        const total =
          totalItems !== undefined
            ? totalItems
            : get().totalItems || tours.length;
        const totalPages = Math.ceil(total / get().pageSize);

        // Tìm giá cao nhất trong danh sách tour nếu cần
        if (
          tours.length > 0 &&
          get().maxPossiblePrice === initialState.maxPossiblePrice
        ) {
          const highestPrice = Math.max(
            ...tours.map((tour) => tour.onlyFromCost),
          );
          if (highestPrice > 0) {
            set({
              maxPossiblePrice: highestPrice,
              priceRange: [0, highestPrice],
            });
          }
        }

        set(
          {
            tours,
            totalItems: total,
            totalPages,
          },
          false,
          "setTours",
        );
      },
      setCurrentPage: (currentPage: number) =>
        set({ currentPage }, false, "setCurrentPage"),
      setPageSize: (pageSize: number) => {
        const totalPages = Math.ceil(get().totalItems / pageSize);
        set({ pageSize, totalPages }, false, "setPageSize");
      },
      setPriceRange: (priceRange: [number, number]) =>
        set({ priceRange }, false, "setPriceRange"),
      setIsPriceFilterActive: (isPriceFilterActive: boolean) =>
        set({ isPriceFilterActive }, false, "setIsPriceFilterActive"),
      setSelectedDate: (selectedDate: Date | undefined) =>
        set({ selectedDate }, false, "setSelectedDate"),
      setIsDateFilterActive: (isDateFilterActive: boolean) =>
        set({ isDateFilterActive }, false, "setIsDateFilterActive"),
      setSortBy: (sortBy: string) => set({ sortBy }, false, "setSortBy"),
      resetAllFilters: () => {
        set({
          priceRange: [0, get().maxPossiblePrice],
          isPriceFilterActive: false,
          selectedDate: undefined,
          isDateFilterActive: false,
          sortBy: TourSortBy.Recommended,
          currentPage: 1,
        }, false, "resetAllFilters");
      }
    }),

    {
      name: "Tour Filter Store", 
      enabled: !isProduction(),
    },
  ),
);

export default useTourFilterStore;
