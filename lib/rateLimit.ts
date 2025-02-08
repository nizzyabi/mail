import { NextRequest } from "next/server";

// temp solution for rate limit. in future we should use redis for Rate Limiting

const rateLimitStore = new Map();
const RATE_LIMIT_TIME_FRAME = 24 * 60 * 60 * 1000; // 24 hrs
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per IP per time frame

function rateLimit(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  console.log("IP:", ip);
  if (ip === "unknown") {
    console.warn("Could not determine IP address.");
    return false;
  }

  const now = Date.now();

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, lastRequest: now });
  } else {
    const rateLimitData = rateLimitStore.get(ip);
    if (now - rateLimitData.lastRequest > RATE_LIMIT_TIME_FRAME) {
      // Reset the rate limit for the IP if the time frame has passed
      rateLimitStore.set(ip, { count: 1, lastRequest: now });
    } else {
      // Increment the request count for the IP
      rateLimitData.count++;
      rateLimitData.lastRequest = now;

      if (rateLimitData.count > RATE_LIMIT_MAX_REQUESTS) {
        return false; // Rate limit exceeded
      }
    }
  }

  return true; // Within the rate limit
}

export { rateLimit };
