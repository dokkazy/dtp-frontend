"use client";
import { useLoadingOverlayStore } from "@/stores/loadingStore";
import React from "react";

export default function LoadingOverlay(){
  const { isLoading, message } = useLoadingOverlayStore((state) => state);

  if ( !isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999991] flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center gap-3 rounded-lg bg-white p-6 shadow-lg">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-core"></div>
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
}
