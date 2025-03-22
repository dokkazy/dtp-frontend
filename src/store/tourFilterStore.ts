import { Tour } from "@/types/tours";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type FilterType = {
  tours: Tour[];
  query: string;
};

type FilterActions = {
  setQuery: (query: string) => void;
  setTours: (tours: Tour[]) => void;
  resetQuery: () => void;
};

export type TourFilterStoreType = FilterType & FilterActions;

const initialState: FilterType = {
  tours: [],
  query: "",
};

const useTourFilterStore = create<TourFilterStoreType>()(
  devtools(
    (set) => ({
      ...initialState,
      setQuery: (query: string) => set({ query }, false, "setQuery"), // action name for devtools
      resetQuery: () => set(initialState, false, "resetQuery"),
      setTours: (tours: Tour[]) => set({ tours }, false, "setTours"),
    }),
    {
      name: "Tour Filter Store", // This name will appear in Redux DevTools
      enabled: process.env.NODE_ENV !== "production", // Only enable in development
    },
  ),
);

export default useTourFilterStore;
