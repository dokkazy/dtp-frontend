/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ChevronDown, LandPlot } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";

import { OrderStatus } from "@/types/order";
import { formatDate } from "@/lib/utils";
import { formatPrice, getOrderStatus, getTicketKind } from "@/lib/client/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { links } from "@/configs/routes";
import { useOrderStore } from "@/stores/orderStore";

export default function OrderList() {
  const { displayedOrders, loading, hasMore, fetchOrders, loadMore } =
    useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="flex-1">
        <div className="bg-white p-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách tour đã đặt
              </h2>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
            {/* <Skeleton className="h-6 w-40" /> */}
          </div>
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg border p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <Skeleton className="mb-2 h-6 w-2/3" />
                      <Skeleton className="mb-4 h-4 w-1/3" />
                      <Skeleton className="mb-2 h-4 w-1/2" />
                      <Skeleton className="mb-4 h-4 w-1/4" />
                      <Skeleton className="h-5 w-1/3" />
                    </div>
                    <Skeleton className="h-24 w-24 rounded-md" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="bg-white p-2">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh sách tour đã đặt
            </h2>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {displayedOrders.length > 0 ? (
            <>
              {displayedOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="overflow-hidden rounded-lg border"
                >
                  <Link href={`${links.bookings.href}/${order.orderId}`}>
                    <div className="flex items-start gap-4 p-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="rounded bg-teal-100 p-1 text-teal-600">
                            <LandPlot className="h-4 w-4" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900">
                              {order.tourName}
                            </h3>
                            <p className="text-xs text-gray-500">Tour Ghép</p>
                            <div className="text-xs">
                              <p className="text-teal-600">
                                {formatDate(order.tourDate)}
                              </p>
                              {order.orderTickets.map((ticket) => (
                                <p key={ticket.code}>
                                  {getTicketKind(ticket.ticketKind)} ×{" "}
                                  {ticket.quantity}
                                </p>
                              ))}
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm font-medium">
                                Tổng thanh toán: {formatPrice(order.finalCost)}
                              </p>
                              <p className="text-sm font-medium">
                                Trạng thái đơn hàng:{" "}
                                <span className="text-[#fc7a09]">
                                  {getOrderStatus(order.status)}
                                </span>
                              </p>
                              {order.status === OrderStatus.SUBMITTED && (
                                <Button
                                  variant={"core"}
                                  className="flex items-center justify-center gap-2"
                                >
                                  Thanh toán
                                </Button>
                              )}
                              {order.status ===
                                OrderStatus.AWAITING_PAYMENT && (
                                <Button
                                  variant={"core"}
                                  className="flex items-center justify-center gap-2"
                                >
                                  Tiếp tục thanh toán
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-24 w-24 overflow-hidden rounded-md">
                        <Image
                          src={`${order.tourThumbnail || "/images/quynhonbanner.jpg"}`}
                          alt="Tour Kỳ Co"
                          width={96}
                          height={96}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <Button onClick={loadMore} variant="outline" className="px-6">
                    Xem thêm
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>Chưa có tour nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
