"use client";

import { refreshToken, sessionToken } from "@/lib/http";
import { UserProfile } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(`useAuthContext must be used within AuthProvider`);
  }
  return context;
};

export default function AuthProvider({
  children,
  initialSessionToken = "",
  initialRefreshToken = "",
  user: userProp,
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
  initialRefreshToken?: string;
  user: UserProfile | null;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  useState(() => {
    if (typeof window !== "undefined") {
      sessionToken.value = initialSessionToken;
      refreshToken.value = initialRefreshToken;
    }
  });
  useEffect(() => {
    setUser(userProp);
  }, [])
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
