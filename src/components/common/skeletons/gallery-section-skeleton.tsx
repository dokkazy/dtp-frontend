import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function GallerySectionSkeleton() {
  return (
    <div className="relative h-96 auto-rows-auto gap-1 md:grid md:h-[450px] md:grid-cols-12">
      {/* Skeleton button */}
      <div className="absolute bottom-4 right-4 z-10 h-10 w-32 animate-pulse rounded-md bg-gray-200" />
      
      {/* Mobile skeleton image (visible on small screens) */}
      <div className="relative size-full md:hidden">
        <div className="size-full animate-pulse bg-gray-200" />
      </div>
      
      {/* Large skeleton image - spans 8 columns on medium screens and up */}
      <Card className="row-span-2 hidden overflow-hidden md:col-span-8 md:block">
        <CardContent className="h-full p-0">
          <div className="relative size-full">
            <div className="size-full animate-pulse bg-gray-200" />
          </div>
        </CardContent>
      </Card>

      {/* First small skeleton image - spans 4 columns on medium screens and up */}
      <Card className="hidden overflow-hidden md:col-span-4 md:block">
        <CardContent className="h-full p-0">
          <div className="relative aspect-square w-full">
            <div className="size-full animate-pulse bg-gray-200" />
          </div>
        </CardContent>
      </Card>

      {/* Second small skeleton image - spans 4 columns on medium screens and up */}
      <Card className="hidden overflow-hidden md:col-span-4 md:block">
        <CardContent className="relative h-full p-0">
          <div className="relative aspect-square w-full">
            <div className="size-full animate-pulse bg-gray-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}