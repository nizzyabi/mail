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
      try {
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
      } catch (error) {
        console.error("Rate limiter error:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Internal server error, please try again later",
          },
          { status: 500 },
        );
      }
      // Ensure to exit the case if no rate-limiting error
      break;
    }

    default: {
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/api/auth/early-access"],
};
