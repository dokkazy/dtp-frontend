"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  Carousel as CarouselPrimitives,
} from "@/components/motion-primitives/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { tourApiRequest } from "@/apiRequests/tour";
import { TourList } from "@/types/tours";
import { formatPrice } from "@/lib/utils";
import { links } from "@/configs/routes";
import { Skeleton } from "@/components/ui/skeleton";

export default function PopulationSection() {
  const [data, setData] = useState<TourList>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await tourApiRequest.getOdataTour({
        $top: 9,
        $filter: "isDeleted eq false",
        $orderby: "createdAt desc",
      });
      if (response.status === 200) {
        setData(response.payload.value);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return (
      <section className="mx-auto mb-16 flex max-w-2xl flex-col gap-6 px-4 sm:pb-6 md:max-w-4xl lg:max-w-6xl lg:px-8">
        <h1 className="text-xl font-bold sm:text-3xl">
          Vui chơi hết cỡ tại Quy Nhơn
        </h1>

        {/* Mobile Skeletons */}
        <ScrollArea className="w-full rounded-md md:hidden">
          <div className="flex w-fit gap-4 py-4">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="min-w-[250px] max-w-[300px] flex-1">
                  <Card className="group relative">
                    <Skeleton className="aspect-square h-44 w-full rounded-t-xl" />
                    <CardContent className="sm:p-2 lg:p-6">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="mt-2 h-4 w-20" />
                        <Skeleton className="h-5 w-full" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="hidden h-4 w-16 sm:block" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2.5" />
        </ScrollArea>

        {/* Desktop Skeletons */}
        <CarouselPrimitives
          disableDrag={true}
          className="hidden w-full md:block"
        >
          <CarouselContent>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/3 p-1 pl-1 sm:p-2 md:p-4"
                >
                  <Card className="group relative min-w-[200px] max-w-[250px] lg:min-w-[250px] lg:max-w-[300px]">
                    <Skeleton className="aspect-square h-40 w-full rounded-t-xl" />
                    <CardContent className="sm:p-2 lg:p-6">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-full" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="hidden h-4 w-16 sm:block" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
          </CarouselContent>
        </CarouselPrimitives>
      </section>
    );
  }

  if (data.length === 0) {
    return (
      <section className="mx-auto mb-16 flex max-w-2xl flex-col gap-6 px-4 sm:pb-6 md:max-w-4xl lg:max-w-6xl lg:px-8">
        <h1 className="text-xl font-bold sm:text-3xl">
          Vui chơi hết cỡ tại Quy Nhơn
        </h1>
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-black/80"
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
          <h3 className="mb-1 text-xl font-semibold">
            Không tìm thấy tour nào
          </h3>
          <p className="text-sm text-gray-500">
            Không có tour nào khả dụng trong danh sách này.
          </p>
        </div>
      </section>
    );
  } else {
    return (
      <section className="mx-auto mb-16 flex max-w-2xl flex-col gap-6 px-4 sm:pb-6 md:max-w-4xl lg:max-w-6xl lg:px-8">
        <h1 className="text-xl font-bold sm:text-3xl">
          Vui chơi hết cỡ tại Bình Định
        </h1>
        <ScrollArea className="w-full rounded-md md:hidden">
          <div className="flex w-fit gap-4 py-4">
            {data.map((tour) => (
              <Link
                href={`${links.tour.href}/${tour.id}`}
                key={tour.id}
                className="min-w-[250px] max-w-[300px] flex-1"
              >
                <Card className="group relative transition-transform duration-300 ease-in-out hover:scale-105 md:min-w-[250px] md:max-w-[300px]">
                  <div className="aspect-square h-44 w-full overflow-hidden rounded-t-xl bg-gray-200">
                    <Image
                      src={tour.thumbnailUrl || "/images/quynhonbanner.jpg"}
                      alt=""
                      className="h-full w-full object-cover object-center"
                      width={300}
                      height={300}
                    />
                  </div>
                  <CardContent className="sm:p-2 lg:p-6">
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-600 sm:text-xs lg:text-sm">
                        Tour Bình Định
                      </p>
                      <p
                        className="line-clamp-1 text-base font-semibold lg:text-lg"
                        title={tour.title}
                      >
                        {tour.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-black sm:text-sm lg:text-base">
                          {formatPrice(tour.onlyFromCost)}
                        </p>
                        <p className="hidden text-gray-500 line-through sm:block sm:text-sm lg:text-base">
                          {formatPrice(tour.onlyFromCost * 2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2.5" />
        </ScrollArea>
        <CarouselPrimitives
          disableDrag={true}
          className="hidden w-full md:block"
        >
          <CarouselContent>
            {data.map((tour) => (
              <CarouselItem
                key={tour.id}
                className="basis-1/3 p-1 pl-1 sm:p-2 md:p-4"
              >
                <Link prefetch={false} href={`${links.tour.href}/${tour.id}`}>
                  <Card className="group relative min-w-[200px] max-w-[250px] transition-transform duration-300 ease-in-out hover:scale-105 lg:min-w-[250px] lg:max-w-[300px]">
                    <div className="aspect-square h-40 w-full overflow-hidden rounded-t-xl bg-gray-200">
                      <Image
                        src={tour.thumbnailUrl || "/images/quynhonbanner.jpg"}
                        alt=""
                        className="h-full w-full object-cover object-center"
                        width={300}
                        height={300}
                      />
                    </div>
                    <CardContent className="sm:p-2 lg:p-6">
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-600 sm:text-xs lg:text-sm">
                          Tour Bình Định
                        </p>
                        <p
                          className="line-clamp-1 text-base font-semibold lg:text-lg"
                          title={tour.title}
                        >
                          {tour.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-black sm:text-sm lg:text-base">
                            {formatPrice(tour.onlyFromCost)}
                          </p>
                          <p className="hidden text-gray-500 line-through sm:block sm:text-sm lg:text-base">
                            {formatPrice(tour.onlyFromCost * 2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNavigation
            className="absolute -bottom-12 left-auto top-auto w-full justify-end gap-2"
            classNameButton="bg-teal-500 *:stroke-teal-50"
            alwaysShow
          />
        </CarouselPrimitives>
      </section>
    );
  }
}
