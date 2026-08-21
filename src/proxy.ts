import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { logSlugSchema } from "@/db/schemas/log-schema";

function isPublicRoute(pathname: string): boolean {
  if (pathname === "/" || pathname === "/logs" || pathname === "/search")
    return true;

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 2 && segments[0] === "logs") {
    return logSlugSchema.safeParse(segments[1]).success;
  }

  if (segments.length === 2 && segments[0] === "u") {
    return true;
  }

  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  //Default warning comments from better auth.
  //We do perform auth checks in the relevant server functions/components, but keep these
  //comments for clarity and as a reminder that this is only an optimistic redirect.

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!sign-in|api/auth|api/uploadthing|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js)$).*)",
  ],
};
