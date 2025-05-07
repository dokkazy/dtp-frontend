// "use client";
import Sidebar from "./Sidebar";
// import { usePathname } from "next/navigation";
import React from "react";

export default function AbortLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const pathname = usePathname();
  // const lastSegment = pathname.split("/");
  // if (lastSegment.length >= 3 && lastSegment[1] === "my-bookings") {
  //   return <>{children}</>;
  // } else {
    return (
      <section className="min-h-100vh mx-auto mb-12 mt-24 max-w-6xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Sidebar/User Info */}
          <div className="md:col-span-1">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">{children}</div>
        </div>
      </section>
    );
  // }
}
