"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}${searchParams ? `?${searchParams}` : ""}`;

    // Reset cursor when navigation completes
    document.body.style.cursor = "default";

    // This function would run on component mount and every time the URL changes
    // (which means navigation has completed)
  }, [pathname, searchParams]);

  return null;
}
