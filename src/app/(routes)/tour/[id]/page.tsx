/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft, Home, SearchX } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

import { tourApiRequest } from "@/apiRequests/tour";
import TourDetail from "@/components/sections/tour-detail";
import { Button } from "@/components/ui/button";
import { DailyTicketSchedule, TourDetail as Tour } from "@/types/tours";
import envConfig from "@/configs/envConfig";
import { openGraphProperties } from "@/app/shared-metadata";

type Props = {
  params: { id: string };
};

export type TourDetailType = {
  tourDetail: Tour | null;
  tourSchedule: DailyTicketSchedule[] | [];
};

async function fetchScheduleTicket(id: string) {
  try {
    const response = await tourApiRequest.getScheduleTicketByTourId(id);
    if (!response || response.status !== 200) {
      console.error(
        "Schedule ticket API returned non-200 status:",
        response?.status,
      );
      return [];
    }

    if (!response.payload || !response.payload.data) {
      console.error(
        "Schedule ticket API response missing expected data structure:",
        response.payload,
      );
      return [];
    }

    return response.payload.data;
  } catch (error) {
    console.error("Error fetching schedule tickets:", error);
    return [];
  }
}

async function fetchData(id: string) {
  try {
    const response: any = await tourApiRequest.getById(id);
    if (response.status != 200) {
      return null;
    }
    return response.payload;
  } catch (error) {
    console.error("Error fetching tour detail:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const tourDetail: Tour | null = await fetchData(id);
  if (tourDetail) {
    return {
      title: tourDetail.tour.title,
      description: tourDetail.tour.description,
      openGraph: {
        title: tourDetail.tour.title,
        description: tourDetail.tour.description,
        url: `${envConfig.NEXT_PUBLIC_BASE_URL}/tour/${tourDetail.tour.id}`,
        ...openGraphProperties,
      },
      alternates: {
        canonical: `${envConfig.NEXT_PUBLIC_BASE_URL}/tour/${tourDetail.tour.id}`,
      },
    };
  }
  return {
    title: "Tour không tồn tại",
    description: "Tour không tồn tại",
  };
}

export default async function TourDetailPage({ params }: Props) {
  const { id } = params;

  const [tourDetail, ticketSchedule] = await Promise.all([
    fetchData(id),
    fetchData(id).then((detail) =>
      detail ? fetchScheduleTicket(detail.tour.id) : [],
    ),
  ]);
  let data: TourDetailType | null = null;
  if (tourDetail != null) {
    data = {
      tourDetail: tourDetail,
      tourSchedule: ticketSchedule || [],
    };
  }

  if (data === null) {
    return (
      <div className="mx-auto mt-24 max-w-6xl px-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 rounded-full bg-muted p-6">
            <SearchX className="h-12 w-12 text-muted-foreground" />
          </div>

          <h1 className="mb-2 text-3xl font-bold">Tour không tồn tại</h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            Rất tiếc, tour bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui
            lòng thử tìm kiếm tour khác.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="outline" size="lg">
              <Link href="/tour">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang tour
              </Link>
            </Button>

            <Button asChild variant="core" size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Về trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return <TourDetail data={data} />;
  }
}
