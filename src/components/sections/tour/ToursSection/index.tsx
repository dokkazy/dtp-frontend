/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useRouter } from "next/navigation";

import TourCategory from "./TourCategory";
import TourList from "./TourList";
import TourMap from "./TourMap";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { links } from "@/configs/routes";
import useTourFilterStore from "@/stores/tourFilterStore";
import { tourApiRequest } from "@/apiRequests/tour";
import useDebounce from "@/hooks/use-debounce";
import TourCard from "@/components/cards/TourCard";
import { Tour, TourSortBy } from "@/types/tours";
import TourFilter from "./TourFilter";
import { formatDateToYYYYMMDD } from "@/lib/utils";

export default function ToursSection() {
  const router = useRouter();
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
    setSortBy
  } = useTourFilterStore((state) => state);
  const debouncedValue = useDebounce(query, 500);
  const tourListSectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const skip = (currentPage - 1) * pageSize;

        let filterString = `contains(title, '${debouncedValue.trim()}') and isDeleted eq false`;
        if (isPriceFilterActive) {
          filterString += ` and onlyFromCost ge ${priceRange[0]} and onlyFromCost le ${priceRange[1]}`;
        }
        if (isDateFilterActive && selectedDate) {
          const formattedDate = formatDateToYYYYMMDD(selectedDate);
          filterString += ` and tourScheduleResponses/any(t: t/openDate eq ${formattedDate})`;
        }
        const params: Record<string, any> = {
          $filter: filterString,
          $top: pageSize,
          $skip: skip,
          $count: true,
        };

        if (sortBy === TourSortBy.PriceAsc) {
          params.$orderby = "onlyFromCost asc";
        } else if (sortBy === TourSortBy.PriceDesc) {
          params.$orderby = "onlyFromCost desc";
        }

        const response = await tourApiRequest.getOdataTour(params);
        const total =
          response.payload["@odata.count"] || response.payload.value.length;
        setTours(response.payload.value || [], total);

        console.log("Tours fetched:", response.payload.value);
      } catch (error) {
        setTours([], 0);
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  console.table({
    tours,
    currentPage,
    pageSize,
    totalItems,
    priceRange,
    isPriceFilterActive,
    query,
    isDateFilterActive,
    selectedDate,
  });

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
            <div className={`w-full lg:basis-[30%]`}>
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
            <div className="lg:basis-[70%]" ref={tourListSectionRef}>
              <TourFilter
                tourCount={totalItems}
                tours={tours}
                onApplyFilter={handlePageChange}
                isLoading={loading}
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
                Xem {tours.length} ở Quy Nhơn
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
