"use client";
import { refreshToken, sessionToken } from "@/lib/http";
import { useState } from "react";

export default function AuthProvider({
  children,
  initialSessionToken = "",
  initialRefreshToken = "",
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
  initialRefreshToken?: string;
}) {
  useState(() => {
    if (typeof window !== "undefined") {
      sessionToken.value = initialSessionToken;
      refreshToken.value = initialRefreshToken;
    }
  });

  return <>{children}</>;
}
