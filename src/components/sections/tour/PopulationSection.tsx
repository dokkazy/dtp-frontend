import Image from "next/image";
import Link from "next/link";

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

async function fetchData() {
  try {
    const response = await tourApiRequest.getOdataTour({
      $top: 9,
      $filter: "isDeleted eq false",
      $orderby: "createdAt desc",
    });
    if (response.status === 200) {
      return response.payload.value;
    }
    return null;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return null;
}

export default async function PopulationSection() {
  const data: TourList | null = await fetchData();
  if (data === null) {
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
          <CarouselNavigation
            className="absolute -bottom-12 left-auto top-auto w-full justify-end gap-2"
            classNameButton="bg-teal-500 *:stroke-teal-50"
            alwaysShow
          />
        </CarouselPrimitives>
      </section>
    );
  }

  return (
    <section className="mx-auto mb-16 flex max-w-2xl flex-col gap-6 px-4 sm:pb-6 md:max-w-4xl lg:max-w-6xl lg:px-8">
      <h1 className="text-xl font-bold sm:text-3xl">
        Vui chơi hết cỡ tại Quy Nhơn
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
                    src={tour.thumbnailUrl}
                    alt=""
                    className="h-full w-full object-cover object-center"
                    width={300}
                    height={300}
                  />
                </div>
                <CardContent className="sm:p-2 lg:p-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-600 sm:text-xs lg:text-sm">
                      Tour Quy Nhơn
                    </p>
                    <p
                      className="line-clamp-1 text-base font-semibold lg:text-lg"
                      title={tour.title}
                    >
                      {tour.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-black sm:text-sm lg:text-base">
                        {formatPrice(tour.onlyFromCost)}đ
                      </p>
                      <p className="hidden text-gray-500 line-through sm:block sm:text-sm lg:text-base">
                        {formatPrice(tour.onlyFromCost * 2)}đ
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
      <CarouselPrimitives disableDrag={true} className="hidden w-full md:block">
        <CarouselContent>
          {data.map((tour) => (
            <CarouselItem
              key={tour.id}
              className="basis-1/3 p-1 pl-1 sm:p-2 md:p-4"
            >
              <Link href={`${links.tour.href}/${tour.id}`}>
                <Card className="group relative min-w-[200px] max-w-[250px] transition-transform duration-300 ease-in-out hover:scale-105 lg:min-w-[250px] lg:max-w-[300px]">
                  <div className="aspect-square h-40 w-full overflow-hidden rounded-t-xl bg-gray-200">
                    <Image
                      src={tour.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover object-center"
                      width={300}
                      height={300}
                    />
                  </div>
                  <CardContent className="sm:p-2 lg:p-6">
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-600 sm:text-xs lg:text-sm">
                        Tour Quy Nhơn
                      </p>
                      <p
                        className="line-clamp-1 text-base font-semibold lg:text-lg"
                        title={tour.title}
                      >
                        {tour.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-black sm:text-sm lg:text-base">
                          {formatPrice(tour.onlyFromCost)}đ
                        </p>
                        <p className="hidden text-gray-500 line-through sm:block sm:text-sm lg:text-base">
                          {formatPrice(tour.onlyFromCost * 2)}đ
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
