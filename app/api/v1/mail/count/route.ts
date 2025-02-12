import type { NextRequest } from "next/server";
import { createDriver } from "../driver";
import { account } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export const GET = async ({ headers, nextUrl }: NextRequest) => {
  const session = await auth.api.getSession({ headers });
  if (!session) return new Response("Unauthorized", { status: 401 });
  const [foundAccount] = await db.select().from(account).where(eq(account.userId, session.user.id));
  if (!foundAccount?.accessToken || !foundAccount.refreshToken)
    return new Response("Unauthorized, reconnect", { status: 402 });
  const driver = createDriver(foundAccount.providerId, {
    auth: {
      access_token: foundAccount.accessToken,
      refresh_token: foundAccount.refreshToken,
    },
  });
  return new Response(JSON.stringify(await driver.count()));
};
