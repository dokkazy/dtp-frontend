"use client";
import { Calendar, User, CreditCard, Home, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
import { formatDate, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/providers/CartProvider";
import { PaymentStatus } from "@/types/checkout";
import { links } from "@/configs/routes";

export default function PaymentSuccess() {
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(
    null,
  );
  const params = useParams();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const cancel = searchParams.get("cancel");
  const status = searchParams.get("status");
  const { removePaymentItem, clearDirectCheckoutItem } = useCartStore(
    (state) => state,
  );
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("paymentStartTime");
    removePaymentItem(cancel as unknown as boolean, status as PaymentStatus);
    clearDirectCheckoutItem();
  }, [removePaymentItem, cancel, status, router, clearDirectCheckoutItem]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (!params.id) {
        console.error("No order ID provided in URL params");
        return;
      }
      const response = await orderApiRequest.getOrderDetailClient(
        params.id as string,
      );
      console.log("Order detail response:", response);
      if (response.status !== 200) {
        throw new Error("Failed to fetch order detail");
      }
      const data: OrderDetailResponse = response.payload;
      setOrderDetail(data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching order detail:", error);
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto my-12">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="mb-6 flex items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-core"></div>
          </div>
          <p className="text-center text-gray-500">
            Vui lòng đợi trong giây lát.
          </p>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-bold">
            Không tìm thấy thông tin tour đặt trước
          </h1>
          <p className="text-muted-foreground">
            Tour không tồn tại hoặc đã bị xóa. Hãy kiểm tra lại tour trong danh
            sách đặt tour của bạn.
          </p>
          <div>
            <Button asChild variant="outline" className="mt-4">
              <Link href={links.home.href}>Trở về trang chủ</Link>
            </Button>
            <Button asChild variant="outline" className="mt-4">
              <Link href={links.bookings.href}>Danh sách tour đã đặt</Link>
            </Button>
          </div>
        </div>
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
              src={orderDetail?.tourThumbnail || "/images/quynhonbanner.jpg"}
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
                {orderDetail?.orderTickets.map((ticket, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-muted-foreground">
                      Vé ({ticket.quantity})
                    </span>
                    <span>{formatPrice(ticket.grossCost)}</span>
                  </div>
                ))}

                {orderDetail?.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(orderDetail?.discountAmount)}</span>
                  </div>
                )}

                <Separator className="my-2" />

                <div className="flex justify-between font-medium">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(orderDetail?.grossCost)}</span>
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
              <Link href={links.bookings.href}>Xem danh sách đặt tour</Link>
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
