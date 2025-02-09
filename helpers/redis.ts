import { Redis } from "@upstash/redis";

const url = process.env.REDIS_URL;
const token = process.env.REDIS_TOKEN;

if (!url || !token) {
  throw new Error("Missing Redis URL or token");
}

export const redis = new Redis({ url, token });
