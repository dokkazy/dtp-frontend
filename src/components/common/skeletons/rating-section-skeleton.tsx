import React from "react";

export default function RatingSectionSkeleton() {
  return (
    <div className="mx-auto p-4">
      {/* Overall Rating Skeleton */}
      <div className="border-b">
        <div className="mb-6 flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-end">
              <div className="h-10 w-16 animate-pulse rounded bg-gray-200" />
              <div className="mb-1 h-5 w-8 animate-pulse rounded bg-gray-200 ml-1" />
            </div>
            <div className="mt-1 flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-5 w-5 animate-pulse rounded bg-gray-200 mr-0.5" />
              ))}
            </div>
          </div>
          <div className="h-5 w-44 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <div className="h-9 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-9 w-24 animate-pulse rounded-full bg-gray-200" />
          <div className="h-9 w-28 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Individual Reviews Skeletons */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="mb-6 border-t pt-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="mb-2 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-4 animate-pulse rounded bg-gray-200 mr-0.5" />
            ))}
            <div className="ml-2 h-4 w-20 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="mb-2 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>

          {/* Review Photos Skeleton */}
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative h-28 w-28 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}