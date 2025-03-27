"use client";
import { Calendar, User, CreditCard, Home, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderDetailResponse } from "@/types/order";
import { orderApiRequest } from "@/apiRequests/order";
import Spinner from "@/components/common/Spinner";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useCartStore } from "@/providers/CartProvider";
import { PaymentStatus } from "@/types/checkout";

export default function PaymentSuccess() {
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(
    null,
  );
  const params = useParams();
  const searchParams = useSearchParams();
  const cancel = searchParams.get("cancel");
  const status = searchParams.get("status");
  const { removePaymentItem } = useCartStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("isCheckoutProcessing");
    localStorage.removeItem("paymentStartTime");
    localStorage.removeItem("checkoutUrl");

    // Xóa cookie
    document.cookie = "isCheckoutProcessing=; path=/; max-age=0";
    removePaymentItem(cancel as unknown as boolean, status as PaymentStatus);
  }, [removePaymentItem, cancel, status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!params.id) {
          console.error("No order ID provided in URL params");
          return;
        }
        const response = await orderApiRequest.getOrderDetail(
          params.id as string,
        );
        console.log("Order detail response:", response);
        if (response.status !== 200) {
          throw new Error("Failed to fetch order detail");
        }
        const data: OrderDetailResponse = response.payload;
        setOrderDetail(data);
      } catch (error) {
        console.log("Error fetching order detail:", error);
      }
    };
    fetchData();

  }, [params.id, router, orderDetail]);

  if (!orderDetail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="text-core" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card className="overflow-hidden">
        <div className="bg-green-500 px-6 py-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">Thanh toán thành công!</h1>
        </div>

        <CardHeader className="flex-row items-center gap-4 space-y-0 border-b px-6 py-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-md">
            <Image
              src={orderDetail?.tourThumnail || "/images/eo-gio.jpg"}
              alt={orderDetail?.tourName || ""}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{orderDetail?.tourName}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(orderDetail?.tourDate)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-medium">Thông tin đặt tour</h3>
              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tour code:</span>
                  <span className="font-medium">{orderDetail?.refCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày đặt:</span>
                  <span>{formatDate(orderDetail?.orderDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Ngày bắt đầu tour:
                  </span>
                  <span>{formatDate(orderDetail?.tourDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số lượng vé:</span>
                  <span>
                    {orderDetail?.orderTickets.reduce(
                      (sum, ticket) => sum + ticket.quantity,
                      0,
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">Thông tin khách hàng</h3>
              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{orderDetail?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {orderDetail?.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orderDetail?.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-lg font-medium">Thông tin thanh toán</h3>
            <div className="rounded-lg border p-4">
              <div className="space-y-2">
                {orderDetail.orderTickets.map((ticket, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-muted-foreground">
                      Vé ({ticket.quantity})
                    </span>
                    <span>{formatCurrency(ticket.grossCost)} ₫</span>
                  </div>
                ))}

                {orderDetail.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(orderDetail.discountAmount)} ₫</span>
                  </div>
                )}

                <Separator className="my-2" />

                <div className="flex justify-between font-medium">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(orderDetail.grossCost)} ₫</span>
                </div>

                <div className="mt-2 flex items-center gap-2 rounded-md bg-green-50 p-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <CreditCard className="h-4 w-4" />
                  <span>Đã thanh toán thành công</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap justify-center gap-4 border-t px-6 py-4 sm:justify-between">
          {/* <ReceiptDownloadButton paymentData={paymentData} /> */}
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/my-order">Xem danh sách đặt tour</Link>
            </Button>
            <Button asChild variant="core">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Trở về trang chủ
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
