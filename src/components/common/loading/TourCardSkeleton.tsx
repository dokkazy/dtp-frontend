import { Skeleton } from "@/components/ui/skeleton";

export default function TourCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Image placeholder */}
      <Skeleton className="h-36 w-full" />

      <div className="p-3">
        {/* Title placeholder - 2 lines */}
        <div className="mb-2 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Rating line placeholder */}
        <div className="mb-2 flex items-center space-x-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>

        {/* Price and CTA placeholder */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-7 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
}