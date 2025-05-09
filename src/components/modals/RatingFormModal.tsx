"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Home, LandPlot, Loader2, SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { orderApiRequest } from "@/apiRequests/order";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderDetailResponse } from "@/types/order";
import { HttpError } from "@/lib/http";
import { formatDate, getTicketKind } from "@/lib/utils";
import RatingForm from "@/components/sections/rating/RatingForm";

interface RatingFormModalProps {
  id: string;
  isOpen: boolean;
}

export function RatingFormModal({ id, isOpen }: RatingFormModalProps) {
  const [loading, setLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(null);
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
            console.error("Error fetching order detail:", error.payload.message);
            toast.error(error.payload.message);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Đánh giá tour</DialogTitle>
          <DialogDescription>
            Chia sẻ trải nghiệm của bạn về tour này
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Đang tải thông tin tour...
            </span>
          </div>
        ) : !orderDetail ? (
          <div className="py-8 text-center">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-6 rounded-full bg-muted p-4">
                <SearchX className="h-8 w-8 text-muted-foreground" />
              </div>

              <h1 className="mb-2 text-xl font-bold">Tour không tồn tại</h1>
              <p className="mb-4 max-w-md text-sm text-muted-foreground">
                Rất tiếc, tour bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                  <Link href="/my-bookings">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại đặt tour
                  </Link>
                </Button>

                <Button asChild variant="core" size="sm">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Về trang chủ
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Tour Info */}
            <div className="overflow-hidden rounded-lg border">
              <div className="flex items-start gap-4 p-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="rounded bg-teal-100 p-1 text-teal-600">
                      <LandPlot className="h-4 w-4" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                        {orderDetail.tourName}
                      </h3>
                      <p className="text-xs text-gray-500">Tour Ghép</p>
                      <div className="text-xs">
                        <p className="text-teal-600">
                          {formatDate(orderDetail.tourDate)}
                        </p>
                        {orderDetail.orderTickets.map((ticket) => (
                          <p key={ticket.code}>
                            {getTicketKind(ticket.ticketKind)} × {ticket.quantity}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-24 w-24 overflow-hidden rounded-md">
                  <Image
                    src={`${orderDetail.tourThumbnail || "/images/quynhonbanner.jpg"}`}
                    alt=""
                    width={96}
                    height={96}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Rating Form */}
            <RatingForm
              onClose={() => onOpenChange(false)}
              orderId={id}
              tourId={orderDetail.tourId}
              tourScheduleId={orderDetail.tourScheduleId}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default RatingFormModal;