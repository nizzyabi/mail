import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { db } from "@/db";

type User = {
  id: string;
  email: string;
  name?: string;
  image?: string;
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    google: {
      // Remove this before going to prod, it's to force to get `refresh_token` from google, some users don't have it yet.
      prompt: "consent",
      accessType: "offline",
      scope: ["https://mail.google.com/"],
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  callbacks: {
    authorized: ({
      auth,
      request,
    }: {
      auth: { user: User } | null;
      request: Request & { nextUrl: URL };
    }) => {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = request.nextUrl.pathname.startsWith("/login");

      if (!isLoggedIn && !isOnLoginPage) {
        return Response.redirect(new URL("/login", request.url));
      }

      return true;
    },
  },
});
