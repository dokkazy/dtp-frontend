"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, Check, Minus, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { links } from "@/configs/routes";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/providers/CartProvider";
import { formatCurrency, formatPrice, getTicketKind, isDateInPast } from "@/lib/utils";
import { useSyncCartAcrossTabs } from "@/hooks/useSyncCartAcrossTabs";
import { Input } from "@/components/ui/input";

export default function ShoppingCart() {
  const router = useRouter();
  const {
    cart,
    selectedItems,
    selectAll,
    paymentItem,
    removeFromCart,
    updateQuantity,
    removeTicket,
    selectItem,
    removeSelectedItems,
    selectForPayment,
    removePaymentItem,
    toggleSelectAll,
    setQuantityDirectly,
  } = useCartStore((state) => state);

  console.log("cart", cart);
  useSyncCartAcrossTabs();

  const handleQuantityInputChange = (
    tourScheduleId: string,
    ticketTypeId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setQuantityDirectly(tourScheduleId, ticketTypeId, value);
    }
  };

  const handleCheckout = () => {
    if (paymentItem) {
      router.push(`${links.checkout.href}/${paymentItem.tourScheduleId}`);
    }
  };

  const handleRemoveSelectedItems = () => {
    Swal.fire({
      title: "Xóa tour khỏi giỏ hàng?",
      html: `Các tour đã chọn sẽ bị xóa khỏi giỏ hàng của bạn.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00bba7",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        removeSelectedItems();

        Swal.fire({
          title: "Đã xóa!",
          text: "Tour đã được xóa khỏi giỏ hàng.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleRemoveItem = (tourScheduleId: string, tourTitle: string) => {
    Swal.fire({
      title: "Xóa tour khỏi giỏ hàng?",
      html: `Tour <strong>${tourTitle}</strong> sẽ bị xóa khỏi giỏ hàng của bạn.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00bba7",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(tourScheduleId);

        Swal.fire({
          title: "Đã xóa!",
          text: "Tour đã được xóa khỏi giỏ hàng.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleUpdateQuantity = (
    tourScheduleId: string,
    ticketTypeId: string,
    action: "increase" | "decrease",
  ) => {
    const result = updateQuantity(tourScheduleId, ticketTypeId, action);

    if (result && result.needConfirmation) {
      Swal.fire({
        title: "Xóa vé khỏi giỏ hàng?",
        html: result.isLastTicket
          ? `Tour <strong>${result.tourTitle}</strong> sẽ bị xóa khỏi giỏ hàng của bạn.`
          : `Vé <strong>${getTicketKind(result.ticketType)}</strong> sẽ bị xóa khỏi tour <strong>${result.tourTitle}</strong>.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00bba7", // Màu teal/core
        cancelButtonColor: "#6B7280", // Màu gray
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          removeTicket(tourScheduleId, ticketTypeId);
          Swal.fire({
            title: "Đã xóa!",
            text: "Vé đã được xóa khỏi giỏ hàng.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    }
    if (result && result.isExceeded) {
      toast.error("Số lượng vé không được vượt quá số lượng tối đa cho phép.");
    }
  };

  return (
    <div className="container mx-auto mb-16 mt-24 max-w-2xl space-y-6 px-4 sm:pb-6 lg:max-w-7xl lg:px-8">
      {cart.length === 0 ? (
        <div className="flex">
          <div className="mx-auto">
            <Image
              width={200}
              height={200}
              alt=""
              src={"/images/empty-cart.svg"}
            />
            <h3 className="mt-6 text-center text-xl font-medium text-gray-500">
              Giỏ hàng đang trống
            </h3>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Cart items */}
          <div className="w-full space-y-4 lg:w-3/4">
            <Card>
              <CardContent className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={selectAll}
                      onCheckedChange={(checked) =>
                        toggleSelectAll(checked as boolean)
                      }
                      className="data-[state=checked]:border-core data-[state=checked]:bg-core"
                    />
                    <Label htmlFor="select-all" className="text-sm font-medium">
                      Tất cả
                    </Label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveSelectedItems}
                    disabled={selectedItems.length === 0}
                    className="text-sm"
                  >
                    Xóa dịch vụ đã chọn
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="mb-6">
              <div className="space-y-4 p-0">
                {cart.map((item) => {
                  const isExpired = isDateInPast(item.day);
                  return (
                    <Card key={item.tourScheduleId}>
                      <CardContent className="flex gap-4 p-8">
                        <div className="flex items-start">
                          <Checkbox
                            id={`item-${item.tourScheduleId}`}
                            checked={selectedItems.includes(
                              item.tourScheduleId,
                            )}
                            onCheckedChange={(checked) =>
                              selectItem(
                                item.tourScheduleId,
                                checked as boolean,
                              )
                            }
                            className="data-[state=checked]:border-core data-[state=checked]:bg-core"
                          />
                        </div>
                        <div className="flex w-full">
                          <div className="flex basis-[70%] gap-6">
                            <div className="flex-shrink-0 h-20 w-20">
                              <Image
                                src={
                                  item.tour.tourDestinations[0].imageUrls[0] ||
                                  "/images/quynhonbanner.jpg"
                                }
                                alt={""}
                                width={300}
                                height={300}
                                className="rounded-md size-full object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-base font-medium">
                                {item.tour.tour.title}
                              </h3>
                              <p className="line-clamp-2 text-sm text-gray-600">
                                {/* {item.tour.tour.description} */}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.day}
                              </p>
                            </div>
                          </div>

                          <div className="flex basis-[30%] flex-col items-end gap-4">
                            {!isExpired &&
                              item.tickets.map((ticket) => (
                                <div
                                  key={ticket.ticketTypeId}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-nowrap text-sm">
                                    {getTicketKind(ticket.ticketKind)} -{" "}
                                    {formatPrice(ticket.netCost)}
                                  </span>
                                  <div className="flex items-center">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7 rounded-md"
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item.tourScheduleId,
                                          ticket.ticketTypeId,
                                          "decrease",
                                        )
                                      }
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    {/* <span className="w-8 text-center mx-2">
                                      {ticket.quantity}
                                    </span> */}
                                    <Input
                                      type="number"
                                      className="mx-2 h-7 w-fit text-center text-sm"
                                      min="1"
                                      max={ticket.availableTicket}
                                      value={ticket.quantity}
                                      onChange={(e) =>
                                        handleQuantityInputChange(
                                          item.tourScheduleId,
                                          ticket.ticketTypeId,
                                          e,
                                        )
                                      }
                                      onBlur={(e) => {
                                        // Đảm bảo giá trị hợp lệ khi focus ra khỏi input
                                        if (
                                          e.target.value === "" ||
                                          parseInt(e.target.value) < 1
                                        ) {
                                          setQuantityDirectly(
                                            item.tourScheduleId,
                                            ticket.ticketTypeId,
                                            1,
                                          );
                                        }
                                      }}
                                    />
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7 rounded-md"
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item.tourScheduleId,
                                          ticket.ticketTypeId,
                                          "increase",
                                        )
                                      }
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}

                            <div className="flex items-center">
                              {isExpired ? (
                                <div className="flex items-center text-sm text-red-500">
                                  <AlertTriangle className="mr-1 h-4 w-4" />
                                  Đã hết hạn
                                </div>
                              ) : (
                                <Button
                                  variant={
                                    paymentItem?.tourScheduleId ===
                                    item.tourScheduleId
                                      ? "core"
                                      : "outline"
                                  }
                                  size="sm"
                                  className={`rounded-full ${paymentItem?.tourScheduleId === item.tourScheduleId ? "" : "text-gray-500"}`}
                                  onClick={() => {
                                    if (
                                      paymentItem?.tourScheduleId ===
                                      item.tourScheduleId
                                    ) {
                                      // If this item is already selected, remove it
                                      removePaymentItem();
                                    } else {
                                      // Otherwise, select this item
                                      selectForPayment(item.tourScheduleId);
                                    }
                                  }}
                                >
                                  {paymentItem?.tourScheduleId ===
                                  item.tourScheduleId ? (
                                    <span className="flex items-center gap-1">
                                      <Check className="h-4 w-4" /> Đã chọn
                                    </span>
                                  ) : (
                                    "Chọn thanh toán"
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="mt-4 flex items-center justify-between border-t p-4 pt-0">
                        <div className="flex gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-gray-500"
                            disabled={isExpired}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-gray-500"
                            onClick={() =>
                              handleRemoveItem(
                                item.tourScheduleId,
                                item.tour.tour.title,
                              )
                            }
                          >
                            Xóa
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">
                            ₫ {formatCurrency(item.totalPrice)}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Payment summary - sticky */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-24">
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="font-medium">Tổng tiền</h3>
                  {!paymentItem && (
                    <p className="text-sm text-orange-500">
                      Vui lòng chọn một tour để thanh toán
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold">
                    ₫{" "}
                    {paymentItem
                      ? formatCurrency(paymentItem.totalPrice)
                      : "0.00"}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    variant="core"
                    className="w-full py-6 text-lg font-medium"
                    disabled={!paymentItem}
                    onClick={handleCheckout}
                  >
                    Thanh toán
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
