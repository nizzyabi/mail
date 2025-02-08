import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const fetchRoute = process.env.BETTER_AUTH_COOKIE_FETCH as string;
  const isProductLaunched = process.env.IS_LAUNCHED;
  const redirectRoute = isProductLaunched === "true" ? "/signin" : "/";

  const { data: session } = await betterFetch<Session>(fetchRoute, {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  if (!session) {
    return NextResponse.redirect(new URL(redirectRoute, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mail"],
};
