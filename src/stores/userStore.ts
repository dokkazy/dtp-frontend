import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UserProfile } from "@/types/user";
import { isProduction } from "@/lib/utils";

interface UserType {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

interface UserActions {
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
}

export type UserStoreType = UserType & UserActions;

export const useUserStore = create<UserStoreType>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }, false, "setUser"),
      clearUser: () =>
        set({ user: null, isAuthenticated: false }, false, "clearUser"),
    }),
    {
      name: "User Store",
      // Optionally disable DevTools in production
      enabled: !isProduction(),
    },
  ),
);
