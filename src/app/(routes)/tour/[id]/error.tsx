"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto mt-24 max-w-6xl px-4">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 rounded-full bg-red-100 p-6">
          <SearchX className="h-12 w-12 text-destructive" />
        </div>

        <h1 className="mb-2 text-3xl font-bold">Đã có lỗi xảy ra</h1>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button onClick={() => reset()} variant="outline" size="lg">
            Thử lại
          </Button>
        </div>
      </div>
    </div>
  );
}
