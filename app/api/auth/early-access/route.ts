import { NextRequest, NextResponse } from "next/server";
import { earlyAccess } from "@/db/schema";
import { nanoid } from "nanoid";
import { db } from "@/db";

type PostgresError = {
  code: string;
  message: string;
};

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const now = new Date();

    try {
      await db.insert(earlyAccess).values({
        id: nanoid(),
        email,
        createdAt: now,
        updatedAt: now,
      });
    } catch (err) {
      // Silently ignore duplicate email errors
      if ((err as PostgresError)?.code !== "23505") {
        throw err;
      }
    }

    return NextResponse.json({ message: "Successfully joined early access" }, { status: 201 });
  } catch (error) {
    console.error("Early access registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
