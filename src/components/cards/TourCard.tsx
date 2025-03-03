import React from "react";
import { Tour } from "@/lib/data";
import Image from "next/image";

interface TourCardProps {
  tour: Tour;
  isSelected: boolean;
  onClick: () => void;
}

export default function TourCard({ tour, isSelected, onClick }: TourCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  return (
    <div
      className={`h-full transform animate-fade-up overflow-hidden rounded-xl border border-core bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isSelected ? "ring-tour-primary ring-2" : ""}`}
      onClick={onClick}
      id={`tour-${tour.id}`}
    >
      <div className="relative">
        <Image
          src={tour.imageUrl}
          alt={tour.title}
          className="h-36 w-full object-cover"
          loading="lazy"
          width={300}
          height={300}
        />
      </div>

      <div className="p-3">
        <h3 className="mb-2 line-clamp-2 h-10 text-sm font-semibold">
          {tour.title}
        </h3>

        <div className="mb-2 flex items-center text-xs">
          <div className="inline-flex items-center text-yellow-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 font-medium">{tour.rating}</span>
            <span className="ml-1 text-gray-600">({tour.reviewCount})</span>
            <span className="mx-1 text-gray-400">•</span>
            <span className="text-gray-600">{tour.bookingCount} Đã đặt</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-gray-500">Từ</span>
            <div className="inline-flex items-center text-sm font-semibold text-core">
              ₫ {formatCurrency(tour.price)}
              {tour.originalPrice && (
                <span className="ml-2 text-xs text-gray-400 line-through">
                  ₫ {formatCurrency(tour.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button className="bg-tour-primary rounded-lg px-2 py-1 text-xs font-medium text-white transition-all hover:bg-opacity-90">
            Đặt
          </button>
        </div>
      </div>
    </div>
  );
}
