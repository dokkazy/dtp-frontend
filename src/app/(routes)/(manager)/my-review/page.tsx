import Image from "next/image";
import React from "react";

export default function ReviewPage() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div>
        <Image
          src={"/images/review-gif.gif"}
          alt="Review Image"
          priority
          width={500}
          height={500}
          className="h-32 w-32 object-cover"
        />
      </div>
      <h3 className="mb-1 text-lg font-semibold">Chưa có hoạt động nào</h3>
      <p className="text-sm text-gray-500">
        Sẵn sàng cho chuyến đi sắp tới? Hãy trải nghiệm và viết đánh giá
      </p>
    </div>
  );
}
