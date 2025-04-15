import envConfig from "@/configs/envConfig";
import MyOrderDetail from "./MyOrderDetail";
import { orderApiRequest } from "@/apiRequests/order";
import { HttpError } from "@/lib/http";
import { OrderDetailResponse } from "@/types/order";
import { Metadata } from "next";
import { openGraphProperties } from "@/app/shared-metadata";
import { cookies } from "next/headers";

async function getOrderDetail(id: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("_auth");
  if (!token) {
    return null;
  }
  try {
    const response = await orderApiRequest.getOrderDetail(id, token.value);
    if (response.status !== 200) {
      return null;
    }
    return response.payload;
  } catch (error) {
    if (error instanceof HttpError) {
      console.error("Error fetching order detail:", error.payload.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;
  const orderDetail: OrderDetailResponse | null = await getOrderDetail(id);
  if (orderDetail) {
    return {
      title: orderDetail.tourName,
      description: `Chi tiết đơn hàng ${orderDetail.code}`,
      openGraph: {
        title: orderDetail.tourName,
        description: `Chi tiết đơn hàng ${orderDetail.code}`,
        url: `${envConfig.NEXT_PUBLIC_BASE_URL}/my-orders/${id}`,
        ...openGraphProperties,
      },
      alternates: {
        canonical: `${envConfig.NEXT_PUBLIC_BASE_URL}/my-orders/${id}`,
      },
    };
  }
  return {
    title: "Order không tồn tại",
    description: "Order không tồn tại",
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <MyOrderDetail id={params.id} />;
}
