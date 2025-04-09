import { MapPin, Sun, Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { TourActivity, TourDestination } from "@/types/tours";
import { formatTime } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const getIcon = (type: string) => {
  switch (type) {
    case "destination":
      return <MapPin className="h-5 w-5 text-emerald-500" />;
    case "activity":
      return <Sun className="h-4 w-4 text-amber-500" />;
    default:
      return <Coffee className="h-4 w-4 text-amber-500" />;
  }
};

const ActivityItem = ({ activity }: { activity: TourActivity }) => {
  return (
    <div className="group flex items-start gap-2 py-1 pl-4">
      <div className="mt-0.5">{getIcon("activity")}</div>
      <div className="flex-1">
        <div className="font-medium transition-colors group-hover:text-blue-600">
          {activity.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
        </div>
      </div>
    </div>
  );
};

export default function ServiceDetail({
  data,
}: {
  data: TourDestination[] | undefined;
}) {
  const sortedDestinations = data
    ? [...data].sort((a, b) => a.sortOrder - b.sortOrder)
    : [];
  return (
    <div className="w-full rounded-lg border p-6">
      <Accordion collapsible type="single" className="w-full pb-6">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg md:text-xl">Lịch trình</AccordionTrigger>
          <AccordionContent className="space-y-0 px-4">
              {sortedDestinations.map((destination, index) => (
                <div key={index} className="group flex gap-4 md:gap-6">
                  {/* Left side - time and icon */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-blue-600">
                      {formatTime(destination.startTime)}
                    </div>
                    <div className="z-10 mt-1 rounded-full border border-blue-100 bg-white p-2 shadow-sm">
                      {getIcon("destination")}
                    </div>
                    <div className="mt-2 w-px flex-1 bg-blue-100 group-last:bg-transparent"></div>
                  </div>

                  {/* Right side - content */}
                  <div className="flex-1 pb-8 pt-1">
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      {destination.imageUrls &&
                        destination.imageUrls.length > 0 && (
                          <div className="relative h-40 w-full">
                            <Image
                              src={
                                destination.imageUrls[0] || "/placeholder.svg"
                              }
                              alt={destination.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // Fallback for broken images
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "/placeholder.svg?height=160&width=400";
                              }}
                            />
                          </div>
                        )}
                      <CardContent className="p-4">
                        <div className="text-lg font-bold">
                          {destination.name}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {formatTime(destination.startTime)} -{" "}
                          {formatTime(destination.endTime)}
                        </div>

                        {destination.activities &&
                          destination.activities.length > 0 && (
                            <div className="mt-3 border-t pt-2">
                              {/* Sort activities by sortOrder */}
                              {[...destination.activities]
                                .sort((a, b) => a.sortOrder - b.sortOrder)
                                .map((activity, index) => (
                                  <ActivityItem
                                    key={index}
                                    activity={activity}
                                  />
                                ))}
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg md:text-xl">Thông tin tập trung/đón khách</AccordionTrigger>
        </AccordionItem>
        <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg md:text-xl">Quy định</AccordionTrigger>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg md:text-xl">
            Điều khoản chung
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <ul className="list-disc space-y-2 pl-4 text-base">
              <li>
                Bạn sẽ nhận được email xác nhận trong vòng 24 giờ. Nếu không
                nhận được email, hãy liên hệ đội ngũ chăm sóc khách hàng của
                chúng tôi.
              </li>
              <li>
                Bạn sẽ được hoàn tiền đầy đủ nếu huỷ đơn hàng trước 24 giờ kể từ
                thời điểm bắt đầu hoạt động
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
