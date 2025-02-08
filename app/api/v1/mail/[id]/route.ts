import { NextRequest } from "next/server";
import { createDriver } from "../driver";
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
  if (!foundAccount?.accessToken) return new Response("Unauthorized", { status: 401 });
  const gmail = createDriver("google", {
    auth: foundAccount.accessToken,
  });
  const res = await gmail.get(id);
  return new Response(JSON.stringify(res));
};
