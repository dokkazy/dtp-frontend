/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { tourApiRequest } from "@/apiRequests/tour";
import { RatingResponse } from "@/types/tours";

export default function RatingSection() {
  const params: { id: string } = useParams();
  const id = params.id as string;
  const [ratingData, setRatingData] = useState<RatingResponse[]>([]);
  useEffect(() => {
    const fetchTourRating = async () => {
      try {
        const response: any = await tourApiRequest.GetRatingByTourId(id);
        setRatingData(response?.payload.data);
      } catch (error) {
        console.error("Error fetching tour rating:", error);
      }
    };
    fetchTourRating();
  }, [id]);

  if (ratingData.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="rounded-lg border p-6">Chưa có đánh giá nào</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4">
      {ratingData.map((item) => (
        <div key={item.id} className="">
          {/* Overall Rating */}
          <div className="mb-6 flex items-center gap-6">
            <div className="flex flex-col">
              <div className="flex items-end">
                <span className="text-4xl font-bold">4.5</span>
                <span className="mb-1 text-gray-500">/5</span>
              </div>
              <div className="flex text-orange-400">
                <Star className="h-5 w-5 fill-orange-400" />
                <Star className="h-5 w-5 fill-orange-400" />
                <Star className="h-5 w-5 fill-orange-400" />
                <Star className="h-5 w-5 fill-orange-400" />
                <Star
                  className="h-5 w-5 fill-orange-400 stroke-orange-400"
                  strokeWidth={1}
                >
                  <path
                    d="M12 4.5V2.5"
                    className="fill-none stroke-orange-400"
                  />
                </Star>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Dựa trên 4K+ lượt đánh giá
            </div>
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            <Button className="rounded-full border border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-100">
              Tất cả
            </Button>
          </div>

          {/* User Review */}
          <div className="border-t pt-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src="/images/quynhonbanner.jpg"
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="object-cover object-center"
                />
              </div>
              <div>
                <div className="font-medium">{item.userName}</div>
                {/* <div className="text-sm text-gray-500">25/12/2024</div> */}
              </div>
            </div>

            <div className="mb-2 flex text-orange-400">
              <Star className="h-4 w-4 fill-orange-400" />
              <Star className="h-4 w-4 fill-orange-400" />
              <Star className="h-4 w-4 fill-orange-400" />
              <Star className="h-4 w-4 fill-orange-400" />
              <Star className="h-4 w-4 fill-orange-400" />
              <span className="ml-2 text-sm text-black">Rất hài lòng</span>
            </div>

            <div className="mb-2 text-sm">{item.comment}</div>

            {/* Review Photos */}
            <div className="mb-4 grid grid-cols-6 gap-2">
              {item.images != null &&
                item.images.map((img) => (
                  <div
                    key={img}
                    className="relative h-20 overflow-hidden rounded-lg"
                  >
                    <Image
                      src={`${img}`}
                      alt={`Review image ${img}`}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
