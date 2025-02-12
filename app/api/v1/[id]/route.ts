import { createDriver } from "../mail/driver";
import { NextRequest } from "next/server";
import { account } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export const GET = async (
  { headers }: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const session = await auth.api.getSession({ headers });
  if (!session) return new Response("Unauthorized", { status: 401 });
  const [foundAccount] = await db.select().from(account).where(eq(account.userId, session.user.id));
  if (!foundAccount?.accessToken || !foundAccount.refreshToken)
    return new Response("Unauthorized", { status: 401 });
  const driver = createDriver(foundAccount.providerId, {
    auth: {
      access_token: foundAccount.accessToken,
      refresh_token: foundAccount.refreshToken,
    },
  });
  const res = await driver.get(id);
  return new Response(JSON.stringify(res));
};
