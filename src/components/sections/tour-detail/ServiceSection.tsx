/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import { Calendar, Minus, Plus, ShieldAlert } from "lucide-react";
import { vi } from "date-fns/locale";
import { StyledElement } from "react-day-picker";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  cn,
  formatCurrency,
  formatDateToDDMMYYYY,
  getTicketKind,
} from "@/lib/client/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import useServiceSectionStore from "@/stores/tourDetailServiceStore";
import { useCartStore } from "@/providers/CartProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { links } from "@/configs/routes";
import { sessionToken } from "@/lib/http";
import { TourDetailType } from "@/app/(routes)/tour/[id]/page";
import { formatPrice } from "@/lib/utils";

export default function ServiceSection({ data }: { data: TourDetailType }) {
  const pathname = usePathname();
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const router = useRouter();
  const {
    showPackage,
    calendarOpen,
    date,
    ticketSchedule,
    selectedDayTickets,
    ticketQuantities,
    totalPrice,
    setTicketSchedule,
    setCalendarOpen,
    handleDateSelect,
    handleConfirmDateSelection,
    handleQuantityChange,
    clearAll,
    togglePackage,
  } = useServiceSectionStore();

  const addToCart = useCartStore((state) => state.addToCart);
  const setDirectCheckoutItem = useCartStore(
    (state) => state.setDirectCheckoutItem,
  );
  console.log("ticketSchedule", ticketSchedule);
 
  useEffect(() => {
    clearAll();
    setTicketSchedule([]);
    setLoading(true);
    setTicketSchedule(data.tourSchedule);
    setLoading(false);
  }, [data.tourSchedule, setTicketSchedule, clearAll]);

  const handleAddToCart = () => {
    if (data.tourDetail == null) return;
    if (!sessionToken.value) {
      toast.warning("Vui lòng đăng nhập để tiếp tục");
      router.push(`${links.login.href}?redirect=${pathname}`);
      return;
    }
    if (!date || selectedDayTickets.length === 0) {
      toast.warning("Vui lòng chọn ngày và số lượng vé");
      return;
    }

    // Check if at least one ticket has quantity > 0
    const hasSelectedTickets = Object.values(ticketQuantities).some(
      (qty) => qty > 0,
    );

    if (!hasSelectedTickets) {
      toast.warning("Vui lòng chọn ít nhất một vé");
      return;
    }

    // Find the current selected day data
    const selectedDay = ticketSchedule.find(
      (day) => new Date(day.day).toDateString() === date.toDateString(),
    );

    if (!selectedDay) return;

    // Get the tourScheduleId from the first ticket (they all share the same schedule ID)
    const tourScheduleId = selectedDayTickets[0]?.tourScheduleId || "";

    const formattedDate = formatDateToDDMMYYYY(selectedDay.day);
    // Add to cart
    addToCart(
      data.tourDetail,
      tourScheduleId,
      formattedDate,
      selectedDayTickets,
      ticketQuantities,
    );

    toast.success("Đã thêm vào giỏ hàng");
  };

  const handleOrderDirectly = () => {
    if (data.tourDetail == null) return;
    if (!sessionToken.value) {
      toast.warning("Vui lòng đăng nhập để tiếp tục");
      router.push(`${links.login.href}?redirect=${pathname}`);
      return;
    }
    if (!date || selectedDayTickets.length === 0) {
      toast.warning("Vui lòng chọn ngày và số lượng vé");
      return;
    }

    // Check if at least one ticket has quantity > 0
    const hasSelectedTickets = Object.values(ticketQuantities).some(
      (qty) => qty > 0,
    );

    if (!hasSelectedTickets) {
      toast.warning("Vui lòng chọn ít nhất một vé");
      return;
    }

    // Find the current selected day data
    const selectedDay = ticketSchedule.find(
      (day) => new Date(day.day).toDateString() === date.toDateString(),
    );

    if (!selectedDay) return;

    // Get the tourScheduleId from the first ticket (they all share the same schedule ID)
    const tourScheduleId = selectedDayTickets[0]?.tourScheduleId || "";

    const formattedDate = formatDateToDDMMYYYY(selectedDay.day);
    setDisabled(true);

    setDirectCheckoutItem(
      data.tourDetail,
      tourScheduleId,
      formattedDate,
      selectedDayTickets,
      ticketQuantities,
    );

    // Navigate directly to checkout
    router.push(`${links.checkout.href}/${tourScheduleId}`);
  };

  const availableDates = React.useMemo(() => {
    if (!ticketSchedule) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return ticketSchedule
      .map((day) => {
        // Create new date and set to start of day
        const date = new Date(day.day);
        date.setHours(0, 0, 0, 0);
        return date;
      })
      .filter((date) => {
        // Check if date is tomorrow or later
        // Add 24 hours (in milliseconds) to today
        return date.getTime() >= today.getTime() + 86400000;
      });
  }, [ticketSchedule]);

  const isDateAvailable = React.useCallback(
    (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return availableDates.some(
        (availableDate) => availableDate.toDateString() === date.toDateString(),
      );
    },
    [availableDates],
  );

  const modifiers = React.useMemo(() => {
    return {
      available: availableDates,
    };
  }, [availableDates]);

  const modifiersClassNames = React.useMemo(() => {
    return {
      available:
        "available-day after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-teal-500 after:content-['']",
    } as Partial<StyledElement<string>> & { available: string };
  }, []);

  return (
    <div id="tour-detail-service" className="space-y-8">
      <h2 className="relative pl-3 text-xl font-bold before:absolute before:left-0 before:top-1/2 before:mr-2 before:h-6 before:w-1 before:-translate-y-1/2 before:bg-core before:content-[''] md:text-3xl md:before:h-8">
        Các gói dịch vụ
      </h2>
      <Card className="bg-[#f5f5f5]">
        <CardContent className="space-y-6 px-4 sm:px-6 py-6 md:px-10">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold md:text-xl">
              Vui lòng chọn ngày và gói dịch vụ
            </h3>
            <h3
              className="hidden underline hover:cursor-pointer sm:flex"
              onClick={() => {
                clearAll();
              }}
            >
              Xóa tất cả
            </h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm">Xin chọn ngày đi tour</p>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  disabled={
                    ticketSchedule.length === 0 || availableDates.length === 0
                  }
                  className="rounded-lg"
                  variant="core"
                >
                  {loading ? (
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      <span>
                        {availableDates.length === 0
                          ? "Không có ngày khả dụng"
                          : "Xem trạng thái dịch vụ"}
                      </span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <CalendarComponent
                  mode="single"
                  disabled={(date) => !isDateAvailable(date)}
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  locale={vi}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                />
                <div className="mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-teal-500"></span>
                    <span>Sẵn sàng khởi hành</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ShieldAlert className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent className="w-72 whitespace-normal bg-white text-sm text-black shadow-sm">
                          <p>
                            Hoạt động sẽ diễn ra vào thời gian đã chọn. (Nhà
                            điều hành chỉ có thể hủy hoạt động trong trường hợp
                            không lường trước như thời tiết xấu, v.v.)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleDateSelect(undefined);
                    }}
                  >
                    Xóa
                  </Button>
                  <Button
                    disabled={!date}
                    variant="core"
                    onClick={handleConfirmDateSelection}
                  >
                    Chọn
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <p className="text-sm">Loại gói dịch vụ</p>
            <Button
              variant="ghost"
              className={cn(
                "rounded-lg border border-black md:py-6",
                `${showPackage ? "border-teal-500 bg-teal-50 text-teal-500 hover:bg-teal-50 hover:text-teal-500" : "hover:bg-teal-50"}`,
              )}
              onClick={togglePackage}
              disabled={!date}
            >
              Tour ghép
            </Button>
          </div>
          <div className={cn("space-y-4", showPackage ? "block" : "hidden")}>
            <p className="text-sm">Số lượng</p>
            {selectedDayTickets.map((ticket) => (
              <Card key={ticket.ticketTypeId}>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <h4 className="text-sm font-semibold md:text-base">
                      {getTicketKind(ticket.ticketKind)}
                    </h4>
                    <span className="text-xs text-teal-700">
                      Còn {ticket.availableTicket} vé
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <p className="text-sm font-medium md:text-base">
                      {formatPrice(ticket.netCost)}
                    </p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        className="bg-[#f5f5f5] px-3 py-3 text-black hover:bg-slate-200 sm:px-4 sm:py-5"
                        onClick={() =>
                          handleQuantityChange(
                            ticket.ticketTypeId,
                            ticket.netCost,
                            false,
                          )
                        }
                        disabled={!ticketQuantities[ticket.ticketTypeId]}
                      >
                        <Minus />
                      </Button>
                      <span>{ticketQuantities[ticket.ticketTypeId] || 0}</span>
                      <Button
                        variant="ghost"
                        className="bg-[#f5f5f5] px-3 py-3 text-black hover:bg-slate-200 sm:px-4 sm:py-5"
                        onClick={() =>
                          handleQuantityChange(
                            ticket.ticketTypeId,
                            ticket.netCost,
                            true,
                          )
                        }
                        disabled={
                          ticketQuantities[ticket.ticketTypeId] >=
                          ticket.availableTicket
                        }
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex flex-col md:justify-between gap-4 md:flex-row md:items-center">
              <h3 className="text-xl font-bold">
                {formatCurrency(totalPrice)}₫
              </h3>
              <div className="max-sm:gap-4 sm:space-x-4 px-2 max-sm:flex flex-wrap">
                <Button
                  disabled={disabled}
                  onClick={() => {
                    handleAddToCart();
                  }}
                  className="rounded-xl bg-[#f8c246] p-6 text-sm hover:bg-[#fbcc5e] md:text-base"
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  disabled={disabled}
                  onClick={handleOrderDirectly}
                  className="rounded-xl bg-[#fc7a09] p-6 text-sm hover:bg-[#ff9537] md:text-base"
                >
                  Đặt ngay
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
