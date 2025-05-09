"use client";

import { useEffect, useState } from "react";
import { Loader2, Phone } from "lucide-react";
import { toast } from "sonner";

import { orderApiRequest } from "@/apiRequests/order";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/common/loading/Spinner";
import { OrderDetailResponse, OrderStatus } from "@/types/order";
import { HttpError } from "@/lib/http";
import { formatDateTime, formatPrice, getTicketKind } from "@/lib/client/utils";
import envConfig from "@/configs/envConfig";
import { links } from "@/configs/routes";
import { PaymentRequest } from "@/types/checkout";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/stores/orderStore";

interface OrderDetailModalProps {
  id: string;
  isOpen: boolean;
}

export function OrderDetailModal({ id, isOpen }: OrderDetailModalProps) {
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(
    null,
  );
  const router = useRouter();
  const [open, setOpen] = useState(isOpen);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
    setOpen(open);
  };

  // Fetch order details
  useEffect(() => {
    if (isOpen && id) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await orderApiRequest.getOrderDetail(id);
          setOrderDetail(response.payload);
        } catch (error) {
          if (error instanceof HttpError) {
            console.error(
              "Error fetching order detail:",
              error.payload.message,
            );
          } else {
            toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id, isOpen]);

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

      const paymentResponse = await orderApiRequest.checkout(paymentData);
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
      await fetchOrders();
      router.push(links.bookings.href);
      setOpen(false);
    } catch (error) {
      if (error instanceof HttpError) {
        console.error("Error cancelling payment:", error.payload.message);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chi tiết đặt tour
          </DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết và quản lý đặt tour của bạn
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Đang tải thông tin booking...
            </span>
          </div>
        ) : !orderDetail ? (
          <div className="py-8 text-center">
            <p className="text-lg font-medium text-orange-500">
              Không tìm thấy đơn hàng
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Payment Actions */}
            {(orderDetail?.status === OrderStatus.SUBMITTED ||
              orderDetail?.status === OrderStatus.AWAITING_PAYMENT) && (
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-lg font-medium">
                  {formatPrice(orderDetail?.grossCost)}
                </h3>
                {orderDetail?.status === OrderStatus.SUBMITTED && (
                  <div className="flex flex-wrap items-center gap-4">
                    <Button
                      disabled={paymentLoading}
                      className="flex items-center gap-2"
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
                      onClick={handleCancelPayment}
                      className="flex items-center gap-2"
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
                      className="flex items-center gap-2"
                      onClick={handleContinuePayment}
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
                      onClick={handleCancelPayment}
                      className="flex items-center gap-2"
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
                          Trong vòng 24h sau khi thanh toán, Khách hàng hủy tour
                          sẽ được hoàn 100% số tiền và 70% cho thời gian sau đó.
                        </p>
                      </li>
                      <li>
                        <p>
                          Không được hoàn tiền đối với khách hàng hủy tour trước
                          ngày khởi hành 4 ngày.
                        </p>
                      </li>
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
                      <li>
                        <p>
                          Trong vòng 24h sau khi thanh toán, Khách hàng hủy tour
                          sẽ được hoàn 100% số tiền và 70% cho thời gian sau đó.
                        </p>
                      </li>
                      <li>
                        <p>
                          Không được hoàn tiền đối với khách hàng hủy tour trước
                          ngày khởi hành 4 ngày.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {/* Tour Details */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-lg font-medium">
                {orderDetail?.tourName}
              </h3>
              <div className="rounded-md bg-gray-50 p-3">
                <div className="mb-2 text-sm text-gray-600">Tour Ghép</div>
                <div className="flex justify-between">
                  <p className="text-base">
                    {formatDate(orderDetail?.tourDate)}
                  </p>
                  <div className="flex flex-col gap-1">
                    {orderDetail?.orderTickets.map((ticket) => (
                      <div key={ticket.ticketTypeId} className="text-base">
                        {ticket.quantity} x {getTicketKind(ticket.ticketKind)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="mb-3">
                <h3 className="text-lg font-medium">Thông tin khách hàng</h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tên khách hàng</span>
                  <span className="text-sm font-medium">
                    {orderDetail?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Số điện thoại</span>
                  <span className="text-sm font-medium">
                    {orderDetail?.phoneNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium">
                    {orderDetail?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-lg font-medium">Liên hệ hỗ trợ</h3>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">+84 0853642941</p>
                  <p className="text-xs text-gray-500">
                    Giờ làm việc: 7 ngày/tuần 5:00-17:30
                  </p>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-lg font-medium">
                Thông tin cơ bản về đơn hàng
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tour code:</span>
                  <span className="font-medium">{orderDetail?.code}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ngày đặt đơn:</span>
                  <span>{formatDateTime(orderDetail?.orderDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default OrderDetailModal;
