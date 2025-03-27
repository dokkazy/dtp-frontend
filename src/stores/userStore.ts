import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UserProfile } from "@/types/user";

interface UserType {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

interface UserActions {
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  updateUserProfile: (updatedData: Partial<UserProfile>) => void;
}

export type UserStoreType = UserType & UserActions;

export const useUserStore = create<UserStoreType>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }, false, "setUser"),
      clearUser: () => set({ user: null, isAuthenticated: false }, false, "clearUser"),
      updateUserProfile: (updatedData) =>
        set(
          (state) => ({
            user: state.user ? { ...state.user, ...updatedData } : null,
          }),
          false,
          "updateUserProfile"
        ),
    }),
    {
      name: "User Store",
      // Optionally disable DevTools in production
      enabled: process.env.NODE_ENV !== "production",
    }
  )
);