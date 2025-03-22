"use client";
import React from "react";
import { useRouter } from "next/navigation";

import TourCategory from "./TourCategory";
import TourList from "./TourList";
import TourMap from "./TourMap";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { links } from "@/configs/routes";
import useTourFilterStore from "@/store/tourFilterStore";
import { tourApiRequest } from "@/apiRequests/tour";
import useDebounce from "@/hooks/use-debounce";

export default function ToursSection() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { tours, setTours, query } = useTourFilterStore((state) => state);
  const debouncedValue = useDebounce(query, 500);

  React.useEffect(() => {
    const params = {
      "$filter": `contains(title, '${debouncedValue.trim()}')`,
      "$top": 5,
    };
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await tourApiRequest.getOdataTour(params);
        setTours(response.payload.value || []);
        console.log("Tours fetched:", response.payload.value);
      } catch (error) {
        setTours([]);
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedValue, setTours]);

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
                <TourCategory />
              </div>
            </div>

            {/*Right section*/}
            <div className="lg:basis-[70%]">
              {loading ? (
                <div className="grid grid-cols-1 gap-4 px-12 sm:grid-cols-2 sm:px-0 lg:grid-cols-3"></div>
              ) : (
                <>
                  <TourList tours={tours} />
                </>
              )}
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
        <ScrollArea className="w-full rounded-md">
          {/* First row */}
          <div className="flex w-fit gap-4">
            {/* {tours.map((tour) => (
              <div key={tour.id} className="min-w-[250px] max-w-[300px] flex-1">
                <TourCard key={tour.id} tour={tour} />
              </div>
            ))} */}
          </div>
          <ScrollBar orientation="horizontal" className="h-2.5" />
        </ScrollArea>
        <div className="w-full">
          <Button
            onClick={() => router.push(links.allTour.href)}
            variant="outline"
            className="w-full"
          >
            {/* Xem {tours.length} ở Quy Nhơn */}
          </Button>
        </div>
      </section>
    </>
  );
}
