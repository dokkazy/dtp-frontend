/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

import TourCategory from "./TourCategory";
import TourList from "./TourList";
import TourMap from "./TourMap";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { links } from "@/configs/routes";
import useTourFilterStore from "@/stores/tourFilterStore";
import useDebounce from "@/hooks/use-debounce";
import TourCard from "@/components/cards/TourCard";
import { TourSortBy } from "@/types/tours";
import TourFilter from "./TourFilter";
import { tourApiRequest } from "@/apiRequests/tour";
import { HttpError } from "@/lib/http";

export default function ToursSection() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [tourCount, setTourCount] = React.useState(0);
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
  const tourListSectionRef = React.useRef<HTMLDivElement>(null);

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
  const fetchToursCount = useCallback(async () => {
    try {
      const response = await tourApiRequest.getTourCount();
      if (response.status !== 200) {
        throw new Error("Failed to fetch tours count");
      }
      setTourCount(response.payload.message || 0);
    } catch (error) {
      if(error instanceof HttpError) {
        console.error("Error fetching tours count:", error.payload.message);
      }
    }
  }, []);
  React.useEffect(() => {
    fetchTours();
    fetchToursCount();
  }, [fetchTours, fetchToursCount]);

  const handlePageChange = React.useCallback(
    (page: number) => {
      setCurrentPage(page);

      // Scroll đến ref của TourList section với offset để tránh header
      if (tourListSectionRef.current) {
        const yOffset = -80; // Offset từ top, điều chỉnh theo chiều cao của header nếu cần
        const element = tourListSectionRef.current;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    [setCurrentPage, tourListSectionRef],
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
    <>
      <section className="mx-auto mb-16 hidden max-w-2xl flex-col gap-6 px-4 sm:pb-6 md:flex md:max-w-4xl lg:max-w-6xl lg:px-8">
        <h1 className="text-3xl font-bold">Tất cả hoạt động ở Quy Nhơn</h1>

        <div className="container">
          <div className="flex flex-col gap-6 md:flex-row">
            {/*Left section*/}
            <div className={`w-full md:basis-[40%] lg:basis-[30%]`}>
              <div
                className={`h-[calc(100vh - 1rem)] sticky top-20 space-y-4 overflow-hidden px-12 transition-all duration-300 ease-in-out sm:px-0`}
              >
                {/*Tour Category*/}
                <TourMap />
                <TourCategory
                  query={query}
                  setQuery={setQuery}
                  onResetAllFilters={handleResetAll}
                />
              </div>
            </div>

            {/*Right section*/}
            <div
              className="basis-[60%] lg:basis-[70%]"
              ref={tourListSectionRef}
            >
              <TourFilter
                tourCount={totalItems}
                onApplyFilter={handlePageChange}
              />
              <TourList
                tours={tours}
                isLoading={loading}
                currentPage={currentPage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </section>
      <section
        id="mobile-tour"
        className="mx-auto mb-16 flex w-full max-w-2xl flex-col gap-6 p-4 md:hidden"
      >
        <h1 className="text-xl font-bold sm:text-3xl">
          Tất cả hoạt động ở Quy Nhơn
        </h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
            </div>
            <p className="text-center text-gray-600">
              Đang tải danh sách tour...
            </p>
          </div>
        ) : tours.length > 0 ? (
          <>
            <ScrollArea className="w-full rounded-md">
              <div className="flex w-fit gap-4 py-4">
                {tours.map((tour) => (
                  <div
                    key={tour.id}
                    className="min-w-[250px] max-w-[300px] flex-1"
                  >
                    <TourCard key={tour.id} tour={tour} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="h-2.5" />
            </ScrollArea>
            <div className="w-full">
              <Button
                onClick={() => router.push(links.allTour.href)}
                variant="outline"
                className="w-full"
              >
                Xem {tourCount} ở Quy Nhơn
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h3 className="mb-1 text-lg font-semibold">
              Không tìm thấy tour nào
            </h3>
            <p className="text-sm text-gray-500">
              Không có tour nào khả dụng theo tìm kiếm của bạn.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Vui lòng thử lại với từ khóa khác.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
