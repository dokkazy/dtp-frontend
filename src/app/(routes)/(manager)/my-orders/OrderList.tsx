"use client";
import { ChevronDown, LandPlot } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { OrderResponse } from "@/types/order";
import { formatDate, formatPrice, getTicketKind } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { orderApiRequest } from "@/apiRequests/order";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { links } from "@/configs/routes";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";

const ORDERS_PER_PAGE = 5;

export default function OrderList() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const sortOrdersByDate = (orders: OrderResponse[]) => {
    return [...orders].sort((a, b) => {
      // Parse dates from DD-MM-YYYY format
      const parseDate = (dateStr: string) => {
        if (!dateStr) return new Date(0); // Handle undefined/null dates
        const [day, month, year] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
      };

      const dateA = parseDate(a.tourDate);
      const dateB = parseDate(b.tourDate);

      // Sort in descending order (newest first)
      return dateB.getTime() - dateA.getTime();
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApiRequest.getOrders();
        if (response.status === 200) {
          const allOrders = response.payload;
          const validOrders = allOrders.filter(
            (order: OrderResponse) => order.tourDate,
          );

          // Sort orders by tour date (most recent first)
          const sortedOrders = sortOrdersByDate(validOrders);
          setOrders(sortedOrders);

          const initialOrders = sortedOrders.slice(0, ORDERS_PER_PAGE);
          setDisplayedOrders(initialOrders);
          setHasMore(sortedOrders.length > ORDERS_PER_PAGE);
          setLoading(false);
        }
      } catch (error) {
        if(error instanceof HttpError) {
          console.log("Error fetching orders:", error);

        }else{
          toast.error("Đã có lỗi xảy ra trong quá trình tải đơn hàng.");
        }
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    const nextBatch = orders.slice(0, nextPage * ORDERS_PER_PAGE);
    setDisplayedOrders(nextBatch);
    setCurrentPage(nextPage);
    setHasMore(nextBatch.length < orders.length);
  };

  if (loading) {
    return (
      <div className="flex-1">
        <div className="bg-white p-2">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
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
            <h2 className="text-lg font-semibold text-gray-800">Đơn hàng</h2>
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
                  <Link href={`${links.orders.href}/${order.orderId}`} target="_blank">
                    <div className="flex items-start gap-4 p-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="rounded bg-teal-100 p-1 text-teal-600">
                            <LandPlot className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {order.tourName}
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                              Tour Ghép
                            </p>
                            <div className="mt-2 text-xs">
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

                            <div className="mt-4">
                              <p className="text-sm font-medium">
                                Tổng thanh toán: {formatPrice(order.finalCost)}{" "}
                                đ
                              </p>
                              {/* <div className="mt-1 flex items-center gap-2 text-orange-500">
                            <Clock className="h-4 w-4" />
                            <p className="text-sm">Đang chờ thanh toán 01:59:28</p>
                          </div> */}
                            </div>

                            {/* <div className="mt-4">
                              <Button className="bg-orange-500 text-white hover:bg-orange-600">
                                Thanh toán
                              </Button>
                            </div> */}
                          </div>
                        </div>
                      </div>

                      <div className="h-24 w-24 overflow-hidden rounded-md">
                        <Image
                          src={`${order.tourThumnail}`}
                          alt="Tour Kỳ Co"
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/eo-gio.jpg";
                          }}
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
              <p>Không có đơn hàng nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
