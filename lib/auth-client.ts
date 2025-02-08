import { createAuthClient } from "better-auth/react";

const BASE_URL = process.env.BASE_URL as string;

export const authClient = createAuthClient({
  baseURL: BASE_URL, // the base url of your auth server
});
export const { signIn, signUp, signOut, useSession, getSession, $fetch } = createAuthClient();
