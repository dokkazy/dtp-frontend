import { links } from "@/configs/routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePath = [
  links.profile.href,
  links.checkout.href,
  links.paymentCancel.href,
  links.paymentSuccess.href,
  links.bookings.href,
  links.review.href,
  links.shoppingCart.href,
  "/checkout-processing",
];

const authPath = [links.login.href, links.register.href];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const sessionToken = request.cookies.get("_auth");

  if (privatePath.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL(links.login.href, request.url));
  }

  if (
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/checkout-processing") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith(links.logout.href) ||
    request.nextUrl.pathname.startsWith(links.paymentSuccess.href) ||
    request.nextUrl.pathname.startsWith(links.paymentCancel.href) ||
    request.nextUrl.pathname.includes(".") // Bỏ qua các tệp tĩnh
  ) {
    return NextResponse.next();
  }

  if (authPath.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL(links.home.href, request.url));
  }
  // const isCheckoutProcessing = request.cookies.get(
  //   "isCheckoutProcessing",
  // )?.value;

  // if (isCheckoutProcessing === "true") {
  //   return NextResponse.redirect(new URL("/checkout-processing", request.url));
  // }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/:path*"],
};
