"use client";
import React, { useEffect, useRef } from "react";

import { Tour } from "@/lib/data";
import TourFilter from "./TourFilter";
import TourCard from "@/components/cards/TourCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface TourListProps {
  tours: Tour[];
  selectedTourId: string | null;
  onSelectTour: (tourId: string) => void;
  selectedFilter: string;
  onSelectFilter: (filterId: string) => void;
  isLoading?: boolean;
}

export default function TourList({
  tours,
  selectedTourId,
  onSelectTour,
  selectedFilter,
  onSelectFilter,
  isLoading,
}: TourListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTourId && listRef.current) {
      const selectedElement = document.getElementById(`tour-${selectedTourId}`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedTourId]);

  return (
    <div ref={listRef} className="w-full">
      <TourFilter
        selectedFilter={selectedFilter}
        onSelectFilter={onSelectFilter}
        tourCount={tours.length}
      />

      <div className="grid grid-cols-1 gap-4 px-12 sm:px-0 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? // Show skeletons based on desired number of skeleton items
            Array.from({ length: 12 }, (_, index) => (
              <Skeleton key={index} className="h-40" /> // Adjust height if necessary
            ))
          : tours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                isSelected={tour.id === selectedTourId}
                onClick={() => onSelectTour(tour.id)}
              />
            ))}
      </div>

      <div className="flex justify-center py-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
