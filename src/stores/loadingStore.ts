import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

interface LoadingOverlayState extends LoadingState {
  message: string;
  setMessage: (message: string) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const useLoadingScreenStore = create<LoadingState>((set) => ({
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const useLoadingOverlayStore = create<LoadingOverlayState>((set) => ({
  isLoading: false,
  message: "Đang xử lý...",
  setMessage: (message) => set({ message }),
  setLoading: (loading) => {
    set({ isLoading: loading });
    if (!loading) {
      set({ message: "Đang xử lý..." });
    }
  },
}));
