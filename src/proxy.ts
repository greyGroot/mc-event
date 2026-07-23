import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/hostess")) {
    const hostessCookie = request.cookies.get("hostess_auth")?.value;
    const expectedPassword = process.env.HOSTESS_PASSWORD || "mastercard2026";

    const response = NextResponse.next();
    if (hostessCookie === expectedPassword) {
      response.headers.set("x-hostess-authenticated", "true");
    } else {
      response.headers.set("x-hostess-authenticated", "false");
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/hostess/:path*"],
};
