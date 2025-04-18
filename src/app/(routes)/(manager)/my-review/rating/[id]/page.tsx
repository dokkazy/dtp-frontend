import { cookies } from "next/headers";
import { LandPlot } from "lucide-react";
import Image from "next/image";

import { orderApiRequest } from "@/apiRequests/order";
import RatingForm from "@/components/sections/rating/RatingForm";
import { OrderResponse } from "@/types/order";
import { formatDate, getTicketKind } from "@/lib/utils";

async function fetchOrderDetail(orderId: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("_auth")?.value || "";
  if (!token) {
    throw new Error("No authentication token found");
  }
  const response = await orderApiRequest.getOrderDetail(orderId, token);
  if (response.status === 200) {
    return response.payload;
  } else {
    throw new Error("Failed to fetch order detail");
  }
}

export default async function RatingPage({
  params,
}: {
  params: { id: string };
}) {
  const orderDetail: OrderResponse = await fetchOrderDetail(params.id);
  return (
    <div className="container max-w-full md:max-w-2xl space-y-4 py-6">
      <div className="overflow-hidden rounded-lg border">
        <div className="flex items-start gap-4 p-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="rounded bg-teal-100 p-1 text-teal-600">
                <LandPlot className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-sm sm:text-base text-gray-900">
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
              src={`${orderDetail.tourThumnail || "/images/quynhonbanner.jpg"}`}
              alt=""
              width={96}
              height={96}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      <RatingForm tourId={params.id} />
    </div>
  );
}
