import Image from "next/image";
import {  useEffect, useState } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { links } from "@/configs/routes";
import { formatPrice } from "@/lib/utils";
import { TourList } from "@/types/tours";
import {
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  Carousel as CarouselPrimitives,
} from "@/components/motion-primitives/carousel";
import { usePathname, useRouter } from "next/navigation";
import {
  DesktopSkeletonCard,
  MobileSkeletonCard,
} from "@/components/cards/recommend-card-skeleton";
import { tourApiRequest } from "@/apiRequests/tour";

export default function RecommendedTour() {
  const pathname = usePathname();
  const lagSegment = pathname.split("/").pop();
  const router = useRouter();
  const [data, setData] = useState<TourList | []>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedTours = async () => {
      try {
        const res = await tourApiRequest.getRecommendTours();
        if (res.status === 200) {
          console.log("Recommended tours:", res);
          setData(res.payload.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recommended tours:", error);
        setData([]);
        setLoading(false);
      }
    };
    fetchRecommendedTours();
  }, []);

  const handleRedirect = (id: string) => {
    if (lagSegment === id) {
      return;
    }
    const url = `${links.tour.href}/${id}`;
    router.push(url);
  };

  if (!loading && data.length === 0) {
    return (
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
        <h3 className="mb-1 text-xl font-semibold">Không tìm thấy tour nào</h3>
        <p className="text-sm text-gray-500">
          Không có tour nào khả dụng trong danh sách này.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        {/* Mobile Skeleton Loading */}
        <ScrollArea className="md:hidden">
          <div className="flex w-fit gap-4 py-4">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <MobileSkeletonCard key={index} />
              ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2.5" />
        </ScrollArea>

        {/* Desktop Skeleton Loading */}
        <CarouselPrimitives
          disableDrag={true}
          className="hidden md:block md:max-w-7xl"
        >
          <CarouselContent>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <CarouselItem key={index} className="basis-1/4 p-4 pl-1">
                  <DesktopSkeletonCard />
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselNavigation
            className="absolute -bottom-12 left-auto top-auto w-full justify-end gap-2"
            classNameButton="bg-teal-500 *:stroke-teal-50"
            alwaysShow
          />
        </CarouselPrimitives>
      </>
    );
  }

  return (
    <>
      <ScrollArea className="md:hidden">
        <div className="flex w-fit gap-4 py-4">
          {data?.map((tour) => (
            <div
              onClick={() => handleRedirect(tour.id)}
              key={tour.id}
              className="min-w-[150px] max-w-[200px] flex-1 cursor-pointer"
            >
              <div className="group relative transition-transform duration-300 ease-in-out hover:scale-105">
                <div className="aspect-square h-32 w-full overflow-hidden rounded-xl bg-gray-200">
                  <Image
                    src={tour.thumbnailUrl}
                    alt=""
                    className="h-full w-full object-cover object-center"
                    width={300}
                    height={300}
                  />
                </div>
                <div className="mt-2 px-2">
                  <div className="flex flex-col gap-1">
                    <p
                      className="line-clamp-1 text-sm font-medium sm:text-base"
                      title={tour.title}
                    >
                      {tour.title}
                    </p>
                    <div className="flex items-center text-yellow-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-medium sm:text-sm">
                        {tour.totalRating}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 line-through sm:text-sm">
                        {formatPrice(tour.onlyFromCost * 2)}
                      </p>
                      <p className="text-xs font-medium text-black sm:text-sm">
                        {formatPrice(tour.onlyFromCost)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2.5" />
      </ScrollArea>
      <CarouselPrimitives
        disableDrag={true}
        className="hidden md:block md:max-w-7xl"
      >
        <CarouselContent>
          {data?.map((tour) => (
            <CarouselItem key={tour.id} className="basis-1/4 p-4 pl-1">
              <div
                onClick={() => handleRedirect(tour.id)}
                key={tour.id}
                className="min-w-[150px] max-w-[300px] flex-1 hover:cursor-pointer"
              >
                <div className="group relative rounded-xl border transition-transform duration-300 ease-in-out hover:scale-105">
                  <div className="aspect-square h-40 w-full overflow-hidden rounded-t-xl bg-gray-200">
                    <Image
                      src={tour.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover object-center"
                      width={300}
                      height={300}
                    />
                  </div>
                  <div className="mt-2 p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500">Quy Nhơn</p>
                      <p
                        className="line-clamp-1 text-base font-medium"
                        title={tour.title}
                      >
                        {tour.title}
                      </p>
                      <div className="flex items-center text-yellow-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium">
                          {tour.totalRating}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(tour.onlyFromCost * 2)}
                        </p>
                        <p className="text-sm font-medium text-black">
                          {formatPrice(tour.onlyFromCost)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNavigation
          className="absolute -bottom-12 left-auto top-auto w-full justify-end gap-2"
          classNameButton="bg-teal-500 *:stroke-teal-50"
          alwaysShow
        />
      </CarouselPrimitives>
    </>
  );
}
