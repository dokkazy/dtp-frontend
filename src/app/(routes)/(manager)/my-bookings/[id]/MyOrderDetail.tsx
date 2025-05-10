/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ChevronRight, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { orderApiRequest } from "@/apiRequests/order";
import { OrderDetailResponse, OrderStatus } from "@/types/order";
import { formatDate } from "@/lib/utils";
import { formatDateTime, formatPrice, getTicketKind } from "@/lib/client/utils";
import Spinner from "@/components/common/loading/Spinner";
import { HttpError } from "@/lib/http";
import { Button } from "@/components/ui/button";
import envConfig from "@/configs/envConfig";
import { links } from "@/configs/routes";
import { PaymentRequest } from "@/types/checkout";
import { systemApiRequest, SystemSettings } from "@/apiRequests/system";

export default function MyOrderDetail({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(
    null,
  );
  const [systemSettings, setSystemSettings] = useState<SystemSettings[]>([]);

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

    const fetchSettings = async () => {
      try {
        const response = await systemApiRequest.getSystemSettings();
        console.log(response.payload);
        if (response.status === 200) {
          setSystemSettings(response.payload);
        } else {
          console.error("Error fetching system settings:", response);
        }
      } catch (error) {
        if (error instanceof HttpError) {
          console.error(
            "Error fetching system settings:",
            error.payload.message,
          );
        } else {
          console.error("Error fetching system settings:", error);
        }
      }
    };
    fetchSettings();
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
      setLoading(true);
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
      <div className="container mx-auto my-12">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="mb-6 flex items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-core"></div>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-700">
            Đang tải thông tin booking...
          </h2>
          <p className="text-center text-gray-500">
            Vui lòng đợi trong giây lát để xem chi tiết.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto mb-12 min-h-screen max-w-7xl pb-6 sm:pb-8 lg:pb-12">
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6">
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
                    {systemSettings.length > 0 ? (
                      <>
                        {systemSettings.map((setting: SystemSettings) => {
                          return (
                            <li key={setting.id}>
                              <p>
                                {setting.settingValue}: {setting.settingKey}
                              </p>
                            </li>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <li>
                          <p>
                            Trong vòng 24h sau khi thanh toán, Khách hàng hủy
                            tour sẽ được hoàn 100% số tiền và 70% cho thời gian
                            sau đó.
                          </p>
                        </li>
                        <li>
                          <p>
                            Không được hoàn tiền đối với khách hàng hủy tour
                            trước ngày khởi hành 4 ngày.
                          </p>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
          {orderDetail?.status === OrderStatus.CANCELLED && (
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  disabled
                  className="flex items-center justify-center gap-2 p-6 sm:text-lg"
                  variant="outline"
                >
                  Tour đã hủy
                </Button>
                <div>
                  <ul className="list-disc space-y-2 pl-4 text-sm text-gray-600">
                    {systemSettings.length > 0 ? (
                      <>
                        {systemSettings.map((setting: SystemSettings) => {
                          return (
                            <li key={setting.id}>
                              <p>
                                {setting.settingValue}: {setting.settingKey}
                              </p>
                            </li>
                          );
                        })}
                        <li>
                          <p>
                            Trong vòng 24h sau khi thanh toán, Khách hàng hủy
                            tour sẽ được hoàn 100% số tiền và {systemSettings[2].settingValue}% cho thời gian
                            sau đó.
                          </p>
                        </li>
                        <li>
                          <p>
                            Không được hoàn tiền đối với khách hàng hủy tour
                            trước ngày khởi hành {systemSettings[0].settingValue} ngày.
                          </p>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <p>
                            Trong vòng 24h sau khi thanh toán, Khách hàng hủy
                            tour sẽ được hoàn 100% số tiền và 70% cho thời gian
                            sau đó.
                          </p>
                        </li>
                        <li>
                          <p>
                            Không được hoàn tiền đối với khách hàng hủy tour
                            trước ngày khởi hành 4 ngày.
                          </p>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-3 text-lg font-medium sm:text-2xl">
              {orderDetail?.tourName}
            </h3>
            <div className="rounded-md bg-gray-50 p-3">
              <div className="mb-2 text-sm text-gray-600 sm:text-base">
                Tour Ghép
              </div>
              <div className="flex justify-between">
                <p className="text-sm sm:text-base">
                  {formatDate(orderDetail?.tourDate)}
                </p>
                <div className="text-sm sm:text-base">
                  {orderDetail?.orderTickets.map((ticket) => (
                    <div key={ticket.ticketTypeId}>
                      {ticket.quantity} x {getTicketKind(ticket.ticketKind)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-medium sm:text-2xl">
                Thông tin khách hàng
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 sm:text-base">
                    Tên khách hàng
                  </span>
                  <span className="text-sm sm:text-base">
                    {orderDetail?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 sm:text-base">
                    Số điện thoại
                  </span>
                  <span className="text-sm sm:text-base">
                    {orderDetail?.phoneNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 sm:text-base">
                    Email
                  </span>
                  <span className="text-sm sm:text-base">
                    {orderDetail?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-medium sm:text-2xl">
              Liên hệ nhà điều hành
            </h3>
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
            <h3 className="mb-4 text-lg font-medium sm:text-2xl">
              Liên hệ BinhDinhTour
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 hover:cursor-pointer">
                <MessageCircle className="h-5 w-5 text-gray-500" />
                <span className="text-base">Trò chuyện với BinhDinhTour</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-medium sm:text-2xl">
              Thông tin cơ bản về đơn hàng
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Tour code:</span>
                <span className="font-medium">{orderDetail?.code}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
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
