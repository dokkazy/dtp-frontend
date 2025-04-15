"use client";

import React, { useCallback } from "react";

import useTourFilterStore from "@/stores/tourFilterStore";
import useDebounce from "@/hooks/use-debounce";
import { tourApiRequest } from "@/apiRequests/tour";
import { TourSortBy } from "@/types/tours";
import TourList from "./TourList";
import TourFilter from "@/app/(routes)/tour/all/TourFilter";

export default function AllTour() {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const {
    tours,
    sortBy,
    setTours,
    currentPage,
    setCurrentPage,
    pageSize,
    totalItems,
    priceRange,
    isPriceFilterActive,
    selectedDate,
    isDateFilterActive,
    resetAllFilters,
    setSortBy,
  } = useTourFilterStore((state) => state);
  const debouncedValue = useDebounce(query, 500);
  const mainSectionRef = React.useRef<HTMLElement>(null);

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);

      // Build URL with search params
      const searchParams = new URLSearchParams({
        query: debouncedValue.trim(),
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
        isPriceFilterActive: isPriceFilterActive.toString(),
        isDateFilterActive: isDateFilterActive.toString(),
        sortBy: sortBy.toString(),
      });

      // Add date if it exists
      if (selectedDate) {
        searchParams.append("date", selectedDate.toISOString());
      }

      const response = await tourApiRequest.getAllTours(
        searchParams.toString(),
      );

      if (response.status !== 200) {
        setTours([], 0);
        throw new Error("Failed to fetch tours");
      }
      console.log("Tours fetched successfully:", response.payload.tours);
      setTours(response.payload.tours || [], response.payload.total || 0);
    } catch (error) {
      setTours([], 0);
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedValue,
    setTours,
    currentPage,
    pageSize,
    priceRange,
    isPriceFilterActive,
    selectedDate,
    isDateFilterActive,
    sortBy,
  ]);
  React.useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handlePageChange = React.useCallback(
    (page: number) => {
      setCurrentPage(page);

      if (mainSectionRef.current) {
        const yOffset = -80;
        const element = mainSectionRef.current;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    [setCurrentPage, mainSectionRef],
  );

  const handleResetAll = React.useCallback(() => {
    setSortBy(TourSortBy.Recommended);
    resetAllFilters();
    setCurrentPage(1);
  }, [setCurrentPage, resetAllFilters, setSortBy]);

  React.useEffect(() => {
    if (debouncedValue.trim() !== "") {
      handlePageChange(1);
    }
  }, [debouncedValue, setCurrentPage, handlePageChange]);

  return (
    <main
      ref={mainSectionRef}
      className="mx-auto mb-16 mt-24 max-w-2xl space-y-6 px-4 sm:pb-6"
    >
      <TourFilter
        query={query}
        setQuery={setQuery}
        onResetAllFilters={handleResetAll}
        onApplyFilter={handlePageChange}
      />
      <div className="w-full">
        <TourList
          tours={tours}
          isLoading={loading}
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
