import { type NextRequest, NextResponse } from "next/server";
import { waitlistRateLimiter } from "./lib/rateLimit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const ip = request.headers.get("x-forwarded-for");
  if (!ip) {
    return NextResponse.json(
      {
        success: false,
        error: "Could not determine your IP address, please try again later!",
      },
      { status: 400 },
    );
  }

  switch (pathname) {
    case "/api/auth/early-access": {
      const rateLimiter = await waitlistRateLimiter();
      const { success } = await rateLimiter.limit(ip);
      if (!success) {
        return NextResponse.json(
          {
            success: false,
            error: "Rate limit exceeded, please try again later!",
          },
          { status: 429 },
        );
      }
    }

    default: {
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/api/auth/early-access"],
};
