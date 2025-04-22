/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { tourApiRequest } from "@/apiRequests/tour";
import { RatingResponse } from "@/types/tours";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RatingSectionSkeleton from "@/components/common/skeletons/rating-section-skeleton";

export default function RatingSection() {
  const params: { id: string } = useParams();
  const id = params.id as string;
  const [ratingData, setRatingData] = useState<RatingResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const RATINGS_PER_PAGE = 5;
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRating, setSelectedRating] = useState<RatingResponse | null>(
    null,
  );

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
    return <RatingSectionSkeleton />;
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

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (selectedRating?.images?.length ?? 0) - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (selectedRating?.images?.length ?? 0) - 1 ? 0 : prev + 1,
    );
  };

  const handleShowRatingModal = (rating: RatingResponse) => {
    // setSelectedRating(rating);
    setShowRatingModal(!showRatingModal);
  };

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
        <div key={item.id} className="mb-6 border-t pt-4">
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

          <div className="mb-2">{item.comment}</div>

          {/* Review Photos */}
          {item.images && item.images.length > 0 && (
            <div
              onMouseEnter={() => {
                setCurrentImageIndex(0);
                setSelectedRating(item);
              }}
              onClick={() => handleShowRatingModal(item)}
              className="mb-4 grid grid-cols-2 gap-2 hover:cursor-zoom-in sm:grid-cols-4 md:grid-cols-6"
            >
              {item.images.map((src, index) => {
                const tmpSrc = src.startsWith("https://") ? src : "";
                return (
                  <div
                    key={index}
                    className="relative h-28 w-28 overflow-hidden rounded-lg"
                  >
                    <Image
                      src={tmpSrc || "/images/quynhonbanner.jpg"}
                      alt={`Review image ${index + 1}`}
                      width={600}
                      height={600}
                      className="h-full w-full object-scale-down object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/quynhonbanner.jpg";
                      }}
                    />
                  </div>
                );
              })}
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
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="z-[9999991] max-w-7xl overflow-hidden rounded-lg p-0">
          <div className="flex h-full flex-col md:flex-row">
            {/* Main image section */}
            <div className="relative h-[300px] w-full md:h-[600px] md:w-2/3">
              {selectedRating?.images && selectedRating?.images.length > 0 && (
                <Image
                  src={
                    selectedRating?.images[currentImageIndex] ||
                    "/images/quynhonbanner.jpg"
                  }
                  alt={selectedRating?.images[currentImageIndex] || "Image"}
                  fill
                  className="object-scale-down object-center"
                  priority
                />
              )}

              {/* Navigation controls */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 rounded-md bg-black/50 px-2 py-1 text-sm text-white">
                {currentImageIndex + 1}/{selectedRating?.images.length}
              </div>
            </div>

            {/* Review content section */}
            <div className="max-h-[300px] w-full overflow-y-auto bg-white p-4 md:max-h-[600px] md:w-1/3 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={"/images/quynhonbanner.jpg"} alt={""} />
                  <AvatarFallback>{selectedRating?.userName}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedRating?.userName}</h3>
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-1 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={i < (selectedRating?.star ?? 0) ? "orange" : "none"}
                      stroke="orange"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700">
                  {selectedRating?.comment}
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto bg-white p-4">
            <div className="flex gap-2">
              {selectedRating?.images.map((src, index) => {
                const tmpSrc = src.startsWith("https://") ? src : "";
                return (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative h-16 min-w-20 overflow-hidden rounded-md ${
                      currentImageIndex === index
                        ? "ring-2 ring-black ring-offset-2"
                        : ""
                    }`}
                  >
                    <Image
                      src={tmpSrc || "/images/quynhonbanner.jpg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-scale-down object-center"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
