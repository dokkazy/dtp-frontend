import { NextResponse } from "next/server";
import { tourApiRequest } from "@/apiRequests/tour";

export async function GET() {
  try {
    const response = await tourApiRequest.getOdataTour({
      $top: 8,
      $filter: "isDeleted eq false",
      $orderby: "createdAt desc",
    });
    console.log("response from recommend", response);

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

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch recommended tours",
      },
      { status: 500 },
    );
  } catch (error) {
    console.error("Error fetching recommended tours:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching recommended tours",
      },
      { status: 500 },
    );
  }
}
