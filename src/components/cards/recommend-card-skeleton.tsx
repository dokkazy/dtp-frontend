import { Skeleton } from "@/components/ui/skeleton";

const MobileSkeletonCard = () => {
  return (
    <div className="min-w-[150px] max-w-[200px] flex-1">
      <div className="group relative transition-transform duration-300">
        <div className="aspect-square h-32 w-full overflow-hidden rounded-xl">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="mt-2 px-2">
          <div className="flex flex-col gap-1">
            {/* Title */}
            <Skeleton className="h-4 w-full" />

            {/* Rating */}
            <div className="flex items-center">
              <Skeleton className="h-3 w-16" />
            </div>

            {/* Prices */}
            <div>
              <Skeleton className="mb-1 h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DesktopSkeletonCard = () => {
  return (
    <div className="min-w-[150px] max-w-[300px] flex-1">
      <div className="group relative rounded-xl border transition-transform duration-300">
        <div className="aspect-square h-40 w-full overflow-hidden rounded-t-xl">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="mt-2 p-4">
          <div className="flex flex-col gap-1">
            {/* Location */}
            <Skeleton className="h-3 w-16" />

            {/* Title */}
            <Skeleton className="h-5 w-full" />

            {/* Rating */}
            <div className="flex items-center">
              <Skeleton className="h-3 w-20" />
            </div>

            {/* Prices */}
            <div>
              <Skeleton className="mb-1 h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MobileSkeletonCard, DesktopSkeletonCard };
