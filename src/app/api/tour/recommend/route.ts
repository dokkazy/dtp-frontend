import { NextResponse } from "next/server";
import { tourApiRequest } from "@/apiRequests/tour";
import { HttpError } from "@/lib/http";

export async function GET() {
  try {
    const response = await tourApiRequest.getOdataTour({
      $top: 8,
      $filter: "isDeleted eq false",
      $orderby: "createdAt desc",
    });

    if (response.status === 200) {
      return NextResponse.json(
        {
          success: true,
          data: response.payload.value,
        },
        {
          headers: {
            "Cache-Control":
              "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        },
      );
    }
  } catch (error) {
    console.error("Error fetching recommended tours:", error);
    if (error instanceof HttpError) {
      return NextResponse.json(
        { error: error.payload },
        { status: error.status },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "An error occurred while fetching recommended tours",
        },
        { status: 500 },
      );
    }
  }
}
