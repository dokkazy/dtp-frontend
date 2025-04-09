/* eslint-disable @typescript-eslint/no-explicit-any */
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("Confirmation token:", body.confirmationToken);

  if (body.confirmationToken === "" || body.confirmationToken === undefined) {
    return Response.json(
      {
        message: "Confirmation token is required",
      },
      { status: 400 },
    );
  }

  try {
    const response = await authApiRequest.confirmAccountFromNextServerToServer({
      confirmationToken: body.confirmationToken,
    });
    if (response.status !== 200) {
      return Response.json(response.payload, { status: response.status });
    }
    return Response.json(response.payload, { status: 200 });
    
  } catch (error: any) {
    if (error instanceof HttpError) {
      return Response.json(
        { message: error.payload.message },
        { status: error.status },
      );
    } else {
      return Response.json(
        { message: "An unexpected error occurred" },
        { status: 500 },
      );
    }
  }
}
