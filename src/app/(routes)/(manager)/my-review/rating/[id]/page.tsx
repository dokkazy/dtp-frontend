import { cookies } from "next/headers";
import { ArrowLeft, Home, LandPlot, SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { orderApiRequest } from "@/apiRequests/order";
import RatingForm from "@/components/sections/rating/RatingForm";
import { OrderDetailResponse } from "@/types/order";
import { formatDate, getTicketKind } from "@/lib/utils";
import { HttpError } from "@/lib/http";
import { Button } from "@/components/ui/button";

async function fetchOrderDetail(orderId: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("_auth")?.value || "";
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await orderApiRequest.getOrderDetail(orderId, token);
    if (response.status === 200) {
      return response.payload;
    }
    return null;
  } catch (error) {
    if (error instanceof HttpError) {
      console.error("Error fetching order detail:", error.payload.message);
    } else {
      console.error("Error fetching order detail:", error);
    }
    return null;
  }
}

export default async function RatingPage({
  params,
}: {
  params: { id: string };
}) {
  const orderDetail: OrderDetailResponse = await fetchOrderDetail(params.id);
  if (!orderDetail) {
    return (
      <div className="mx-auto mt-24 max-w-6xl px-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 rounded-full bg-muted p-6">
            <SearchX className="h-12 w-12 text-muted-foreground" />
          </div>

          <h1 className="mb-2 text-3xl font-bold">Tour không tồn tại</h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            Rất tiếc, tour bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui
            lòng thử tìm kiếm tour khác.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="outline" size="lg">
              <Link href="/tour">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang tour
              </Link>
            </Button>

            <Button asChild variant="core" size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Về trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container max-w-full space-y-4 py-6 md:max-w-2xl">
      <div className="overflow-hidden rounded-lg border">
        <div className="flex items-start gap-4 p-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="rounded bg-teal-100 p-1 text-teal-600">
                <LandPlot className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                  {orderDetail.tourName}
                </h3>
                <p className="text-xs text-gray-500">Tour Ghép</p>
                <div className="text-xs">
                  <p className="text-teal-600">
                    {formatDate(orderDetail.tourDate)}
                  </p>
                  {orderDetail.orderTickets.map((ticket) => (
                    <p key={ticket.code}>
                      {getTicketKind(ticket.ticketKind)} × {ticket.quantity}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-24 w-24 overflow-hidden rounded-md">
            <Image
              src={`${orderDetail.tourThumbnail || "/images/quynhonbanner.jpg"}`}
              alt=""
              width={96}
              height={96}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      <RatingForm
        orderId={params.id}
        tourId={orderDetail.tourId}
        tourScheduleId={orderDetail.tourScheduleId}
      />
    </div>
  );
}
