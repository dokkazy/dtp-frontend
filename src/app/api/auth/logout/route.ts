/* eslint-disable @typescript-eslint/no-explicit-any */
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/https";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  if (!sessionToken) {
    return Response.json(
      {
        success: false,
        message: "Session token not found",
      },
      { status: 400 },
    );
  }
  try {
    const response: any = await authApiRequest.logoutFromNextServerToServer(
      sessionToken.value,
    );
    console.log("logout response: ", response);
    if (response.payload.success) {
      return Response.json(
        {
          success: true,
          message: "Đăng xuất thành công",
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": `sessionToken=; Max-Age=0; path=/, role=; Max-Age=0; path=/`,
          },
        },
      );
    } else {
      return Response.json(
        {
          success: false,
        },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Error in logout:", error);
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    }
    return Response.json(
      {
        success: false,
        message: "Có lỗi xảy ra trong quá trình đăng xuất",
      },
      { status: 500 },
    );
  }
}
