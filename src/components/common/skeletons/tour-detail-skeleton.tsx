import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Carousel as CarouselPrimitives,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export function TourDetailSkeleton() {
  return (
    <div className="container mx-auto my-8 space-y-10">
      {/* Gallery Section Skeleton */}
      <GallerySectionSkeleton />

      {/* Service Detail Skeleton */}
      <ServiceDetailSkeleton />

      {/* Service Section Skeleton */}
      <ServiceSectionSkeleton />

      {/* Rating Section Skeleton */}
      <RatingSectionSkeleton />

      {/* Recommended Tour Skeleton */}
      <RecommendedTourSkeleton />
    </div>
  );
}

export function GallerySectionSkeleton() {
  return (
    <div className="relative h-96 auto-rows-auto gap-1 md:grid md:h-[450px] md:grid-cols-12">
      {/* Gallery button skeleton */}
      <div className="absolute bottom-4 right-4 z-10">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Mobile image skeleton */}
      <div className="relative size-full md:hidden">
        <Skeleton className="size-full rounded-lg object-cover" />
      </div>

      {/* Desktop large image skeleton - spans 8 columns */}
      <div className="row-span-2 hidden overflow-hidden rounded-lg md:col-span-8 md:block">
        <Skeleton className="h-full w-full" />
      </div>

      {/* First small image skeleton - spans 4 columns */}
      <div className="hidden overflow-hidden rounded-lg md:col-span-4 md:block">
        <Skeleton className="aspect-square w-full" />
      </div>

      {/* Second small image skeleton - spans 4 columns */}
      <div className="hidden overflow-hidden rounded-lg md:col-span-4 md:block">
        <Skeleton className="aspect-square w-full" />
      </div>
    </div>
  );
}

export function ServiceDetailSkeleton() {
  return (
    <div className="rounded-lg border p-6">
      <div className="space-y-4">
        {/* Title */}
        <Skeleton className="h-8 w-3/4" />

        {/* Description */}
        <div className="space-y-2">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export function ServiceSectionSkeleton() {
  return (
    <div id="tour-detail-service" className="space-y-8">
    {/* Section Title Skeleton */}
    <Skeleton className="h-8 w-1/3" />

    {/* Card Skeleton */}
    <div className="rounded-lg border bg-[#f5f5f5] p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-5 w-20 hidden sm:block" />
      </div>

      {/* Calendar Section Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-10 w-1/2 rounded-lg" />
      </div>

      {/* Package Selection Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-10 w-1/2 rounded-lg" />
      </div>

      {/* Ticket Options Skeleton */}
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          ))}
      </div>

      {/* Footer Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-6 w-1/4" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
  );
}

export function RatingSectionSkeleton() {
  return (
    <div className="rounded-lg border p-6">
      <Skeleton className="mb-6 h-7 w-40" />

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="h-5 w-5 rounded-full" />
            ))}
        </div>
      </div>

      <div className="space-y-6">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="space-y-3 border-b pb-6">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32" />
                  <div className="mt-1 flex space-x-1">
                    {Array(5)
                      .fill(0)
                      .map((_, idx) => (
                        <Skeleton key={idx} className="h-4 w-4 rounded-full" />
                      ))}
                  </div>
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex space-x-2">
                {Array(2)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} className="h-16 w-16 rounded-md" />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export function RecommendedTourSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-56" />

      {/* Mobile Skeleton */}
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

      {/* Desktop Skeleton */}
      <CarouselPrimitives className="hidden md:block md:max-w-7xl">
        <CarouselContent>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <CarouselItem key={index} className="basis-1/4 p-4 pl-1">
                <DesktopSkeletonCard />
              </CarouselItem>
            ))}
        </CarouselContent>
      </CarouselPrimitives>
    </div>
  );
}

export function MobileSkeletonCard() {
  return (
    <div className="w-52 overflow-hidden rounded-lg border shadow-sm">
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DesktopSkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <Skeleton className="h-40 w-full" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
