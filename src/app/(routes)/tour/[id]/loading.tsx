import React from "react";

export default function Loading() {
  return (
    <div className="container mx-auto my-12">
      <div className="flex flex-col items-center justify-center py-32">
        <div className="mb-6 flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-core"></div>
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-700">
          Đang tải thông tin tour...
        </h2>
        <p className="text-center text-gray-500">
          Vui lòng đợi trong giây lát để xem chi tiết tour này.
        </p>
      </div>
    </div>
  );
}