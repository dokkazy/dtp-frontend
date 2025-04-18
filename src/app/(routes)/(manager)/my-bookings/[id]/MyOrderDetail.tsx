/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ChevronRight, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { orderApiRequest } from "@/apiRequests/order";
import { OrderDetailResponse, OrderStatus } from "@/types/order";
import {
  formatDate,
  formatDateTime,
  formatPrice,
  getTicketKind,
} from "@/lib/utils";
import Spinner from "@/components/common/loading/Spinner";
import { HttpError } from "@/lib/http";
import { Button } from "@/components/ui/button";
import envConfig from "@/configs/envConfig";
import { links } from "@/configs/routes";
import { PaymentRequest } from "@/types/checkout";

export default function MyOrderDetail({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(
    null,
  );

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await orderApiRequest.getOrderDetail(id);
        setOrderDetail(response.payload);
        setLoading(false);
      } catch (error) {
        if (error instanceof HttpError) {
          console.error("Error fetching order detail:", error.payload.message);
        } else {
          toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const paymentData: PaymentRequest = {
        bookingId: id,
        responseUrl: {
          returnUrl: `${envConfig.NEXT_PUBLIC_BASE_URL}${links.paymentSuccess.href}/${id}`,
          cancelUrl: `${envConfig.NEXT_PUBLIC_BASE_URL}${links.paymentCancel.href}`,
        },
      };

      const paymentResponse: any = await orderApiRequest.checkout(paymentData);
      console.log(paymentResponse);
      if (paymentResponse.status !== 200) {
        console.error("Error fetching payment data:", paymentResponse);
        toast.error("Có lỗi xảy ra trong quá trình thanh toán");
        return;
      }
      if (paymentResponse.payload.message) {
        localStorage.setItem("checkoutUrl", paymentResponse.payload.message);
        localStorage.setItem("paymentStartTime", Date.now().toString());

        window.location.href = paymentResponse.payload.message;
      } else {
        console.error("Không tìm thấy đường dẫn thanh toán");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error("Có lỗi xảy ra trong quá trình thanh toán");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    try {
      setPaymentLoading(true);
      const response = await orderApiRequest.cancelPaymentByOrderId(id);
      if (response.status !== 204) {
        toast.error("Có lỗi xảy ra trong quá trình hủy thanh toán");
        return;
      }
      toast.success("Hủy thanh toán thành công");
      window.location.reload();
    } catch (error) {
      if (error instanceof HttpError) {
        console.error("Error fetching order detail:", error.payload.message);
        toast.error(error.payload.message);
      } else {
        toast.error("Có lỗi xảy ra trong quá trình hủy thanh toán");
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleContinuePayment = () => {
    setPaymentLoading(true);
    window.location.href = `https://pay.payos.vn/web/${orderDetail?.paymentLinkId}`;
    setTimeout(() => {
      setPaymentLoading(false);
    }, 3000);
  };

  if (!loading && !orderDetail) {
    return (
      <div className="mx-auto mb-12 mt-24 min-h-screen max-w-7xl pb-6 sm:pb-8 lg:pb-12">
        <main className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <h1 className="text-xl font-medium text-orange-500">
                Không tìm thấy đơn hàng
              </h1>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-20 w-20 text-core" />
      </div>
    );
  }
  return (
    <div className="mx-auto mb-12 mt-24 min-h-screen max-w-7xl pb-6 sm:pb-8 lg:pb-12">
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {(orderDetail?.status === OrderStatus.SUBMITTED ||
            orderDetail?.status === OrderStatus.AWAITING_PAYMENT) && (
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-3 text-2xl font-medium">
                {formatPrice(orderDetail?.grossCost)}
              </h3>
              {orderDetail?.status === OrderStatus.SUBMITTED && (
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    disabled={paymentLoading}
                    className="flex items-center justify-center gap-2 p-6 sm:text-lg"
                    onClick={handlePayment}
                    variant="core"
                  >
                    {paymentLoading ? (
                      <>
                        <Spinner className="text-white" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Thanh toán"
                    )}
                  </Button>
                  <Button
                    disabled={paymentLoading}
                    onClick={() => handleCancelPayment()}
                    className="flex items-center justify-center gap-2 p-6 sm:text-lg"
                    variant="outline"
                  >
                    {paymentLoading ? (
                      <>
                        <Spinner className="text-black" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Hủy thanh toán"
                    )}
                  </Button>
                </div>
              )}
              {orderDetail?.status === OrderStatus.AWAITING_PAYMENT && (
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    disabled={paymentLoading}
                    className="flex items-center justify-center gap-2 p-6 sm:text-lg"
                    onClick={() => handleContinuePayment()}
                    variant="core"
                  >
                    {paymentLoading ? (
                      <>
                        <Spinner className="text-white" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Thanh toán"
                    )}
                  </Button>
                  <Button
                    disabled={paymentLoading}
                    className="flex items-center justify-center gap-2 p-6 sm:text-lg"
                    variant="outline"
                    onClick={() => handleCancelPayment()}
                  >
                    {paymentLoading ? (
                      <>
                        <Spinner className="text-black" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Hủy thanh toán"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
          {orderDetail?.status === OrderStatus.PAID && (
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  disabled={paymentLoading}
                  onClick={() => handleCancelPayment()}
                  className="flex items-center justify-center gap-2 p-6 sm:text-lg"
                  variant="outline"
                >
                  {paymentLoading ? (
                    <>
                      <Spinner className="text-black" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Hủy tour"
                  )}
                </Button>
                <div>
                  <ul className="list-disc space-y-2 pl-4 text-sm text-gray-600">
                    <li>
                      <p>
                        Tour đã thanh toán sẽ không được hoàn tiền nếu hủy trong vòng 12h trước khi tour bắt đầu.
                      </p>
                    </li>
                    <li>
                      <p>
                        Nếu hủy trong vòng 24h trước khi tour bắt đầu, bạn sẽ được hoàn tiền 50% giá trị tour.
                      </p>
                    </li>
                    <li>
                      <p>
                        Tour đã thanh toán sẽ được hoàn tiền 100% nếu hủy trước 3 ngày trước khi tour bắt đầu.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-3 text-2xl font-medium">
              {orderDetail?.tourName}
            </h3>
            <div className="rounded-md bg-gray-50 p-3">
              <div className="mb-2 text-base text-gray-600">Tour Ghép</div>
              <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {formatDate(orderDetail?.tourDate)}
                  </span>
                </div>
                {orderDetail?.orderTickets.map((ticket) => (
                  <div key={ticket.ticketTypeId} className="text-base">
                    {ticket.quantity} x {getTicketKind(ticket.ticketKind)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-2xl font-medium">Thông tin khách hàng</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-base text-gray-600">
                    Tên khách hàng
                  </span>
                  <span className="text-base">{orderDetail?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-600">Số điện thoại</span>
                  <span className="text-base">{orderDetail?.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-600">Email</span>
                  <span className="text-base">{orderDetail?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-2xl font-medium">Liên hệ nhà điều hành</h3>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-gray-500" />
              <div>
                <p className="text-base font-medium">+84 0853642941</p>
                <p className="text-sm text-gray-500">
                  Giờ làm việc: 7 ngày/tuần 5:00-17:30
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-2xl font-medium">Liên hệ BinhDinhTour</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 hover:cursor-pointer">
                <MessageCircle className="h-5 w-5 text-gray-500" />
                <span className="text-base">Trò chuyện với BinhDinhTour</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-2xl font-medium">
              Thông tin cơ bản về đơn hàng
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Số đơn hàng:</span>
                <span className="font-medium">{orderDetail?.code}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Ngày đặt đơn:</span>
                <span>{formatDateTime(orderDetail?.orderDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
