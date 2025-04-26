// components/ads/StickyAdBanner.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export default function StickyAdBanner() {
  const [show, setShow] = useState(true);
  const isMobile = useIsMobile();

//   useEffect(() => {
//     if (isMobile) setShow(true);
//   }, [isMobile]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed bottom-0 z-50 w-full bg-yellow-100 px-4 py-3 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              🎉 Ưu đãi từ đối tác TravelNow – Nhận ngay 200k!
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="rounded-full text-center bg-core px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Xem ngay
              </Link>
              <button
                onClick={() => setShow(false)}
                aria-label="Đóng quảng cáo"
              >
                <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
