/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
// import { useCartStore } from "@/store/client/cart-store";
// import { AddContactSheet } from "./add-contact-sheet";
import { Steps } from "./Steps";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/providers/CartProvider";
import { formatCurrency, getTicketKind } from "@/lib/utils";
import { toast } from "sonner";
import { OrderRequest } from "@/types/order";
import { orderApiRequest } from "@/apiRequests/order";
import Spinner from "@/components/common/loading/Spinner";
import { links } from "@/configs/routes";
import envConfig from "@/configs/envConfig";
import { PaymentRequest } from "@/types/checkout";
import { AddContactSheet } from "./add-contact-sheet";
import { useAuthContext } from "@/providers/AuthProvider";

export type Contact = {
  name: string;
  phoneNumber: string;
  email: string;
};

export default function Checkout({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const { paymentItem, directCheckoutItem } = useCartStore((state) => state);
  const checkoutItem = directCheckoutItem || paymentItem;

  useEffect(() => {
    if (!checkoutItem || checkoutItem?.tourScheduleId != itemId) {
      router.push(links.shoppingCart.href);
    }
    if (user) {
      setContact({
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
      });
    }
  }, [itemId, checkoutItem, router, user]);

  if (!user || !checkoutItem || checkoutItem?.tourScheduleId !== itemId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="text-core" />
      </div>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (!checkoutItem) {
        toast.error("Không có đơn hàng nào để thanh toán");
        return;
      }
      const orderData: OrderRequest = {
        tourScheduleId: checkoutItem.tourScheduleId,
        name: user?.name,
        phoneNumber: user?.phoneNumber,
        email: user?.email,
        voucherCode: "",
        tickets: checkoutItem.tickets.map((ticket) => ({
          ticketTypeId: ticket.ticketTypeId,
          quantity: ticket.quantity,
        })),
      };
      console.log("orderData", orderData);
      const orderResponse = await orderApiRequest.order(orderData);
      if (orderResponse.status !== 201) {
        console.error("Error creating order:", orderResponse);
        toast.error("Có lỗi xảy ra trong quá trình thanh toán");
        return;
      }
      localStorage.setItem("lastOrderId", orderResponse.payload.id);

      const paymentData: PaymentRequest = {
        bookingId: orderResponse.payload.id,
        responseUrl: {
          returnUrl: `${envConfig.NEXT_PUBLIC_BASE_URL}${links.paymentSuccess.href}/${orderResponse.payload.id}`,
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
        localStorage.setItem("isCheckoutProcessing", "true");
        localStorage.setItem("checkoutUrl", paymentResponse.payload.message);
        localStorage.setItem("paymentStartTime", Date.now().toString());

        document.cookie = "isCheckoutProcessing=true; path=/; max-age=3600";
        window.location.href = paymentResponse.payload.message;
      } else {
        console.error("Không tìm thấy đường dẫn thanh toán");
      }
    } catch (error: any) {
      console.error("Error during payment:", error?.title || error);
      toast.error("Có lỗi xảy ra trong quá trình thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Steps currentStep={2} />
      <div className="w-full bg-[#f5f5f5]">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="mt-8 flex flex-col gap-6 lg:flex-row">
            <Card className="mb-12 w-full pb-8 lg:w-2/3">
              <CardHeader className="p-4">
                <h3 className="text-xl font-bold text-core">Điền thông tin</h3>
              </CardHeader>
              <Separator />
              <div className="space-y-6">
                <h2 className="relative mt-6 pl-4 text-lg font-medium before:absolute before:left-0 before:top-1/2 before:mr-2 before:h-8 before:w-2 before:-translate-y-1/2 before:bg-core before:content-['']">
                  Thông tin đơn hàng
                </h2>
                {/* Tour Information */}
                <div className="px-8">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <Image
                            src={"/images/eo-gio.jpg"}
                            alt={""}
                            width={90}
                            height={90}
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="mb-1 text-base font-medium">
                            {checkoutItem?.tour?.tour?.title}
                          </h3>
                          <p className="mb-1 line-clamp-2 text-sm text-gray-600">
                            {/* {checkoutItem?.tour.tour.description} */}
                          </p>
                          <p className="text-sm text-gray-600">
                            {checkoutItem?.day}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <h2 className="relative mt-6 pl-4 text-lg font-medium before:absolute before:left-0 before:top-1/2 before:mr-2 before:h-8 before:w-2 before:-translate-y-1/2 before:bg-core before:content-['']">
                  Thông tin liên lạc
                </h2>
                <p className="px-4 text-sm text-gray-600">
                  Chúng tôi sẽ thông báo mọi thay đổi về đơn hàng cho bạn
                </p>
                <div>
                  <div>
                    <p></p>
                  </div>
                </div>
                <div className="px-8">
                  <div className="rounded-lg border border-gray-300 p-4">
                    {contact === null ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className="hidden gap-3 max-md:grid">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm">Tên:</span>
                            <span className="text-sm font-semibold sm:text-base">
                              {contact.name}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm">Số điện thoại: </span>
                            <span className="text-sm font-semibold sm:text-base">
                              {contact.phoneNumber}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-wrap text-sm">
                              Email (để cập nhật thông tin đơn hàng của
                              bạn):{" "}
                            </span>
                            <span className="text-sm font-semibold sm:text-base">
                              {contact.email}
                            </span>
                          </div>
                          <div className="flex w-full justify-end">
                            <p
                              onClick={() => setIsContactSheetOpen(true)}
                              className="text-sm font-medium underline hover:cursor-pointer sm:text-base"
                            >
                              Chỉnh sửa
                            </p>
                          </div>
                        </div>
                        <div className="hidden w-full justify-between md:flex">
                          <div className="flex gap-2">
                            <p className="flex w-full flex-col gap-2 text-sm">
                              <span className="">Tên</span>
                              <span className="">Số điện thoại</span>
                              <span className="text-nowrap">
                                Email (để cập nhật thông tin đơn hàng của bạn)
                              </span>
                            </p>
                            <p className="flex w-full flex-col gap-2 text-sm">
                              <span className="font-semibold">
                                {contact.name}
                              </span>
                              <span className="font-semibold">
                                {contact.phoneNumber}
                              </span>
                              <span className="font-semibold">
                                {contact.email}
                              </span>
                            </p>
                          </div>
                          <div
                            className=""
                            onClick={() => setIsContactSheetOpen(true)}
                          >
                            <p className="text-sm font-medium underline hover:cursor-pointer">
                              Chỉnh sửa
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mx-8 mt-8 rounded-2xl border border-[#ffd471] bg-[#FCF3DE] p-4">
                <p className="">
                  Vui lòng điền thông tin chính xác. Một khi đã gửi thông tin,
                  bạn sẽ không thay đổi được.
                </p>
              </div>

              <div className="mx-8 mt-8 flex justify-between gap-2">
                <p className="basis-2/3 text-sm">
                  Đơn hàng sẽ được gửi đi sau khi thanh toán. Bạn sẽ thanh toán
                  ở bước tiếp theo.
                </p>
                <Button
                  variant="core"
                  className="flex items-center justify-center gap-2 py-6 text-lg"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner className="text-white" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Thanh toán"
                  )}
                </Button>
              </div>

              {/* Contact Information */}
            </Card>

            {/* Payment Summary */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-6 space-y-6 px-4">
                <Card>
                  <CardContent className="space-y-4 py-4">
                    <p className="font-semibold">
                      {checkoutItem?.tour.tour.title}
                    </p>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">Ngày</p>
                      <p>{checkoutItem?.day}</p>
                    </div>
                    <div className="flex w-full justify-between text-sm">
                      <p className="text-gray-500">Đơn vị</p>
                      <div className="text-end">
                        {checkoutItem?.tickets.map((ticket) => (
                          <p key={ticket.ticketTypeId}>
                            {getTicketKind(ticket.ticketKind)} x{" "}
                            {ticket.quantity}
                          </p>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm">
                    <p className="text-gray-500">Tổng cộng</p>
                    <p className="font-medium">
                      ₫ {formatCurrency(checkoutItem?.totalPrice ?? 0)}
                    </p>
                  </CardFooter>
                </Card>
                <Card>
                  <CardContent className="space-y-4 py-8">
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">Tổng cộng</p>
                      <p className="font-medium">
                        ₫ {formatCurrency(checkoutItem?.totalPrice ?? 0)}
                      </p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">Số tiền phải thanh toán</p>
                      <p className="text-xl font-medium text-core">
                        ₫ {formatCurrency(checkoutItem?.totalPrice ?? 0)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {contact && (
            <AddContactSheet
              contact={contact}
              open={isContactSheetOpen}
              onOpenChange={setIsContactSheetOpen}
              onSave={setContact}
            />
          )}
        </div>
      </div>
    </>
  );
}
