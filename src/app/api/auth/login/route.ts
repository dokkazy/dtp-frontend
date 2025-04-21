/* eslint-disable @typescript-eslint/no-explicit-any */
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { getExpirationDateFromToken, getMaxAgeFromToken } from "@/lib/server/utils";
import { LoginResponseSchemaType } from "@/schemaValidations/auth.schema";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const response: LoginResponseSchemaType | any =
      await authApiRequest.loginFromNextServerToServer({
        userName: body.userName,
        password: body.password,
      });
    if (response.payload.success) {
      const sessionToken = response.payload.data.accessToken as string;
      const refreshToken = response.payload.data.refreshToken as string;

      const exprirationDate = getExpirationDateFromToken(sessionToken);
      const maxAge = getMaxAgeFromToken(sessionToken);

      const cookies = [
        `_auth=${sessionToken}; Max-Age=${maxAge}; Expires=${exprirationDate}; Path=/; HttpOnly; SameSite=Lax; Secure`,
        `cont_auth=${refreshToken}; Max-Age=${maxAge}; Expires=${exprirationDate}; Path=/; HttpOnly; SameSite=Lax; Secure`,
      ];
      return Response.json(response.payload, {
        status: 200,
        headers: {
          "Set-Cookie": cookies.join(", "),
        },
      });
    }
  } catch (error: any) {
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
