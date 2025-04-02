"use client";
import Image from "next/image";
import {
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Info,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { orderApiRequest } from "@/apiRequests/order";
import { useParams } from "next/navigation";
import { OrderDetailResponse } from "@/types/order";
import { formatDate, formatDateTime, getTicketKind } from "@/lib/utils";
import Spinner from "@/components/common/loading/Spinner";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(
    null,
  );

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await orderApiRequest.getOrderDetail(params.id);
        setOrderDetail(response.payload);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order detail:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

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
        <Spinner className="text-core h-20 w-20" />
      </div>
    );
  }
  return (
    <div className="mx-auto mb-12 mt-24 min-h-screen max-w-7xl pb-6 sm:pb-8 lg:pb-12">
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
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
