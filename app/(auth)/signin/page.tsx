"use client";

import { Button } from "@/components/ui/button";

import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignIn() {
  return (
    <div className="flex h-dvh w-screen items-start justify-center bg-background pt-12 md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-2 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-1 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Continue with your Google account
          </p>
        </div>
        <div className="flex flex-col space-y-4 px-4 sm:px-16">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={async () => {
              toast.promise(
                signIn.social({
                  provider: "google",
                  callbackURL: "/mail",
                }),
                {
                  loading: "Redirecting...",
                  success: "Redirected successfully!",
                  error: "Login redirect failed",
                },
              );
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M11.99 13.9v-3.72h9.36c.14.63.25 1.22.25 2.05c0 5.71-3.83 9.77-9.6 9.77c-5.52 0-10-4.48-10-10S6.48 2 12 2c2.7 0 4.96.99 6.69 2.61l-2.84 2.76c-.72-.68-1.98-1.48-3.85-1.48c-3.31 0-6.01 2.75-6.01 6.12s2.7 6.12 6.01 6.12c3.83 0 5.24-2.65 5.5-4.22h-5.51z"
              ></path>
            </svg>
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
