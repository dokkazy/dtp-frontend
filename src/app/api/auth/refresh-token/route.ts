import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export type RefreshTokenRequestType = {
  refreshToken: string;
};

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken");
  const sessionToken = cookieStore.get("sessionToken");
  if (!sessionToken || !refreshToken) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
        error: ["Unauthorized"],
      },
      { status: 401 },
    );
  }
  try {
    const body: RefreshTokenRequestType = {
      refreshToken: refreshToken.value,
    };
    const response = await authApiRequest.refreshFromNextServerToServer(
      body,
      sessionToken.value,
    );
    const newSessionToken = response?.payload?.data?.accessToken as string;
    const newRefreshToken = response?.payload?.data?.refreshToken as string;
    const maxAge = response?.payload?.data?.expiresIn as string;

    console.log("res", response);

    const cookies = [
      `sessionToken=${newSessionToken}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax; Secure`,
      `refreshToken=${newRefreshToken}; Max-Age=${60 * 60 * 7 * 24}; Path=/; HttpOnly; SameSite=Lax; Secure`,
    ];

    return Response.json(response?.payload, {
      status: 200,
      headers: {
        "Set-Cookie": cookies.join(", "),
      },
    });
  } catch (error) {
    console.error("Error in refresh token", error);
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          success: false,
          message: "lỗi không xác định",
        },
        { status: 500 },
      );
    }
  }
}
