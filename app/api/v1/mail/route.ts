import { NextRequest } from "next/server";
import { createDriver } from "./driver";
import { account } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";

// Todo: look into a way to get accessToken from session instead of a database query
export const GET = async ({ headers, nextUrl }: NextRequest) => {
  const searchParams = nextUrl.searchParams;
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
  if (!searchParams.has("folder")) return new Response("Bad Request", { status: 400 });
  return new Response(
    JSON.stringify(
      await driver.list(
        searchParams.get("folder")!,
        searchParams.get("q") ?? undefined,
        Number(searchParams.get("max")) ? +searchParams.get("max")! : undefined,
        searchParams.get("labelIds") ? searchParams.get("labelIds")!.split(",") : undefined,
      ),
    ),
  );
};

export const POST = async () => {
  return new Response("Hello World");
};
