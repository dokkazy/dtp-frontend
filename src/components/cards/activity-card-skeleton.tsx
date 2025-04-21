import { Card, CardContent } from "@/components/ui/card";

export function ActivityCardSkeleton() {
    return (
      <Card className="group relative overflow-hidden">
        {/* Image placeholder */}
        <div className="aspect-square w-full rounded-t-xl bg-gray-200 animate-pulse lg:h-80"></div>
        
        {/* Rating badge placeholder */}
        <div className="relative -top-4 left-4 w-24 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        
        <CardContent>
          <div className="flex flex-col gap-2">
            {/* Title placeholder */}
            <div className="h-6 w-4/5 bg-gray-200 rounded animate-pulse"></div>
            
            {/* Original price placeholder */}
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            
            {/* Current price section */}
            <div className="flex items-center justify-between mt-1">
              <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Footer info placeholder */}
            <div className="flex justify-between mt-2">
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }