/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { tourApiRequest } from "@/apiRequests/tour";
import { RatingResponse } from "@/types/tours";
import Spinner from "@/components/common/loading/Spinner";

export default function RatingSection() {
  const params: { id: string } = useParams();
  const id = params.id as string;
  const [ratingData, setRatingData] = useState<RatingResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const RATINGS_PER_PAGE = 5;

  useEffect(() => {
    const fetchTourRating = async () => {
      setLoading(true);
      try {
        const response: any = await tourApiRequest.getRatingByTourId(id);
        setRatingData(response?.payload.data);
      } catch (error) {
        console.error("Error fetching tour rating:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTourRating();
  }, [id]);

  if (loading) {
    return (
      <div className="flex gap-2 h-40 items-center justify-center text-gray-500">
        <Spinner className="text-core" />
        <p>Đang tải...</p>
      </div>
    );
  }

  if (ratingData.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="rounded-lg border p-6">Chưa có đánh giá nào</div>
        </div>
      </div>
    );
  }

  // Calculate average rating
  const avgRating =
    ratingData.reduce((acc, item) => acc + item.star, 0) / ratingData.length;
  const avgRatingFormatted = avgRating.toFixed(1);

  // Calculate pagination details
  const totalPages = Math.ceil(ratingData.length / RATINGS_PER_PAGE);
  const startIndex = currentPage * RATINGS_PER_PAGE;
  const paginatedRatings = ratingData.slice(
    startIndex,
    startIndex + RATINGS_PER_PAGE,
  );

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Helper function to get satisfaction text based on rating
  const getSatisfactionText = (stars: number): string => {
    if (stars === 5) return "Rất hài lòng";
    if (stars === 4) return "Hài lòng";
    if (stars === 3) return "Bình thường";
    if (stars === 2) return "Không hài lòng";
    return "Rất không hài lòng";
  };

  return (
    <div className="mx-auto p-4">
      {/* Overall Rating */}
      <div className="border-b">
        <div className="mb-6 flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-end">
              <span className="text-4xl font-bold">{avgRatingFormatted}</span>
              <span className="mb-1 text-gray-500">/5</span>
            </div>
            <div className="flex text-orange-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= Math.floor(avgRating) ? "fill-orange-400" : ""}`}
                />
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Dựa trên {ratingData.length}+ lượt đánh giá
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <Button className="rounded-full border border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-100">
            Tất cả
          </Button>
        </div>
      </div>

      {/* Individual Reviews */}
      {paginatedRatings.map((item) => (
        <div key={item.id} className="mb-6 pt-4">
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
            <div className="font-medium">{item.userName}</div>
          </div>

          <div className="mb-2 flex text-orange-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= item.star ? "fill-orange-400" : ""}`}
              />
            ))}
            <span className="ml-2 text-sm text-black">
              {getSatisfactionText(item.star)}
            </span>
          </div>

          <div className="mb-2 text-sm">{item.comment}</div>

          {/* Review Photos */}
          {item.images && item.images.length > 0 && (
            <div className="mb-4 grid grid-cols-6 gap-2">
              {item.images.map((img, index) => (
                <div
                  key={index}
                  className="relative h-20 overflow-hidden rounded-lg"
                >
                  <Image
                    src={img}
                    alt={`Review image ${index + 1}`}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm">
            <span className="font-medium">{currentPage + 1}</span>
            <span className="text-muted-foreground"> / {totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            aria-label="Trang tiếp theo"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
