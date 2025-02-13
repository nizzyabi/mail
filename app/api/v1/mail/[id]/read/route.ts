import { createDriver } from "@/app/api/driver";
import { NextRequest } from "next/server";
import { connection } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";

export const POST = async (
  { headers }: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const session = await auth.api.getSession({ headers });
  if (!session) return new Response("Unauthorized", { status: 401 });

  if (!session.connectionId) return new Response("Unauthorized", { status: 401 });

  const [_connection] = await db
    .select()
    .from(connection)
    .where(and(eq(connection.userId, session.user.id), eq(connection.id, session.connectionId)));

  if (!_connection?.accessToken || !_connection.refreshToken)
    return new Response("Unauthorized, reconnect", { status: 402 });

  const driver = await createDriver(_connection.providerId, {
    // Assuming "google" is the provider ID
    auth: {
      access_token: _connection.accessToken,
      refresh_token: _connection.refreshToken,
    },
  });

  try {
    await driver.markAsRead(id);
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
