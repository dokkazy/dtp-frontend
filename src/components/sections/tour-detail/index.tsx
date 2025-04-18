/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Image from "next/image";
import { ChevronRight, MessagesSquare } from "lucide-react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ServiceSection from "./ServiceSection";
import {
  DialogContent,
  DialogHeader,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import GallerySection from "./GallerySection";
import RecommendedTour from "./RecommendedTour";
import { TourDetailType } from "@/app/(routes)/tour/[id]/page";
import ServiceDetail from "./ServiceDetail";
import { formatPrice } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import RatingSection from "./RatingSection";

export default function TourDetail({ data }: { data: TourDetailType | null }) {
  const markup = { __html: `${data?.tourDetail?.tour?.about}` };
  const handleServiceRef = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <div className="mx-auto mb-16 mt-24 max-w-2xl space-y-6 px-4 sm:pb-6 md:max-w-7xl lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tour">Tour Quy Nhơn</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tour">
                {data?.tourDetail?.tour?.companyName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data?.tourDetail?.tour?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-xl font-bold tracking-tight sm:text-4xl md:text-3xl">
          {data?.tourDetail?.tour?.title}
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-amber-500">★</span>
            <span className="ml-1 font-semibold">
              {data?.tourDetail?.tour?.avgStar}
            </span>
          </div>
          <span className="text-muted-foreground">
            ({data?.tourDetail?.tour?.totalRating} Đánh giá)
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">10K+ Đã đặt</span>
        </div>
        {data != null && <GallerySection data={data} />}
        <div className="container min-w-full">
          <div className="grid grid-cols-12 gap-6">
            {/* Tour Description */}
            <div className="col-span-full max-w-full space-y-8 md:col-span-8 md:space-y-16">
              <Card>
                <CardContent className="relative h-32 space-y-4 overflow-hidden p-6 md:h-48">
                  <p className="overflow-hidden text-sm md:text-base">
                    {data?.tourDetail?.tour?.description}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 flex h-[52px] items-center justify-between bg-gradient-to-t from-white to-transparent p-6 backdrop-blur-[6px] hover:underline">
                    <Drawer>
                      <DrawerTrigger asChild>
                        <div className="flex items-center md:hidden">
                          <span className="text-sm font-semibold md:text-lg">
                            Xem thêm
                          </span>
                          <ChevronRight />
                        </div>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <h1 className="text-xl font-bold">Điểm nổi bật</h1>
                        </DrawerHeader>
                        <ScrollArea className="h-[400px] w-full rounded-md p-4">
                          <ul className="list-disc space-y-2 pl-4 text-base text-muted-foreground">
                            {data?.tourDetail?.tour?.description
                              .split(".")
                              .map((sentence) => sentence.trim())
                              .filter((sentence) => sentence)
                              .map((sentence, index) => (
                                <li
                                  className="text-base text-black"
                                  key={index}
                                >
                                  {sentence}
                                </li>
                              ))}
                          </ul>
                          <ScrollBar />
                        </ScrollArea>
                      </DrawerContent>
                    </Drawer>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="hidden items-center md:flex">
                          <span className="text-sm font-semibold md:text-lg">
                            Xem thêm
                          </span>
                          <ChevronRight />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-[750px] p-10">
                        <DialogHeader>
                          <h1 className="text-xl font-bold">Điểm nổi bật</h1>
                        </DialogHeader>
                        <ScrollArea className="h-[400px] w-full rounded-md p-4">
                          <ul className="list-disc space-y-2 pl-4 text-base text-muted-foreground">
                            {data?.tourDetail?.tour?.description
                              .split(".")
                              .map((sentence) => sentence.trim())
                              .filter((sentence) => sentence)
                              .map((sentence, index) => (
                                <li
                                  className="text-base text-black"
                                  key={index}
                                >
                                  {sentence}
                                </li>
                              ))}
                          </ul>
                          <ScrollBar />
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                    <Image
                      src={"/images/best-price.png"}
                      alt="best-price"
                      width={30}
                      height={30}
                    />
                  </div>
                </CardContent>
              </Card>
              {data != null && <ServiceSection data={data} />}
              <div className="">
                <h2 className="relative mb-4 pl-3 text-xl font-bold before:absolute before:left-0 before:top-1/2 before:mr-2 before:h-6 before:w-1 before:-translate-y-1/2 before:bg-core before:content-[''] md:text-3xl md:before:h-8">
                  Chi tiết gói dịch vụ
                </h2>
                {data != null && (
                  <ServiceDetail data={data?.tourDetail?.tourDestinations} />
                )}
              </div>
              <div className="">
                <h2 className="relative mb-4 pl-3 text-xl font-bold before:absolute before:left-0 before:top-1/2 before:mr-2 before:h-6 before:w-1 before:-translate-y-1/2 before:bg-core before:content-[''] md:text-3xl md:before:h-8">
                  Về dịch vụ này
                </h2>
                <div dangerouslySetInnerHTML={markup} className="px-4" />
              </div>

              <div className="mt-12">
                <h2 className="relative mb-4 pl-3 text-xl font-bold before:absolute before:left-0 before:top-1/2 before:mr-2 before:h-6 before:w-1 before:-translate-y-1/2 before:bg-core before:content-[''] md:text-3xl md:before:h-8">
                  Liên hệ với chúng tôi
                </h2>
                <p className="mb-4 text-gray-700">
                  Bạn thắc mắc về dịch vụ này?
                </p>
                <Button
                  className="rounded-lg border border-teal-500 py-6 text-core hover:bg-teal-50 hover:text-teal-500"
                  variant="outline"
                  asChild
                >
                  <Link href="/chat" target="_blank">
                    <MessagesSquare className="h-20 w-20" />
                    <span className="text-base">Chat với chúng tôi</span>
                  </Link>
                </Button>
              </div>
              <div className="mt-12">
                <h2 className="relative mb-4 pl-3 text-xl font-bold before:absolute before:left-0 before:top-1/2 before:mr-2 before:h-6 before:w-1 before:-translate-y-1/2 before:bg-core before:content-[''] md:text-3xl md:before:h-8">
                  Đánh giá
                </h2>
                <RatingSection />
              </div>
            </div>

            {/* Tour price */}
            <div className="hidden md:col-span-4 md:block">
              <Card className="h-[calc(100vh - 1rem)] sticky top-20 h-fit">
                <CardContent className="space-y-4 px-6 py-6">
                  <h1 className="text-lg font-semibold md:text-2xl">
                    {formatPrice(data?.tourDetail?.tour?.onlyFromCost)}
                  </h1>
                  <Button
                    onClick={(e) => handleServiceRef(e, "tour-detail-service")}
                    variant="core"
                    className="w-full text-lg"
                    size="lg"
                  >
                    Đặt ngay
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="mt-12 w-full">
            <h2 className="relative mb-4 pl-3 text-xl font-bold before:absolute before:left-0 before:top-1/2 before:mr-2 before:h-6 before:w-1 before:-translate-y-1/2 before:bg-core before:content-[''] md:text-3xl md:before:h-8">
              Có thể bạn sẽ thích
            </h2>
            <RecommendedTour />
          </div>
        </div>
      </div>

      <div className="hidden" id="mobile-tourdetail"></div>
    </>
  );
}
