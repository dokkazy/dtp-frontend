import { links } from "@/configs/routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { UserRoleEnum } from "@/types/user";

const privatePath = [
  links.passenger.href,
  links.checkout.href,
];


const authPath = [links.login.href, links.register.href];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const sessionToken = request.cookies.get("sessionToken");

  if (privatePath.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL(links.login.href, request.url));
  }
  if (authPath.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL(links.home.href, request.url));
  }


  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    links.passenger.href,
    links.login.href,
    `${links.checkout.href}/:id*`,
    links.register.href,
  ],
};
