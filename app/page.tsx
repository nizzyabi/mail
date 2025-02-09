"use client";

import { Discord, GitHub, Twitter, YouTube } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function BetaSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      toast.promise(
        fetch("/api/auth/early-access", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }).then((response) => {
          if (response.ok) {
            setEmail("");
          }
          return response;
        }),
        {
          loading: "Signing up...",
          success: "Thanks for signing up for early access!",
          error: "Something went wrong. Please try again.",
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-background pt-12 md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-4 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Early Access</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Enter your email to get access once we launch ❤️
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 px-9 sm:px-16">
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase text-gray-600 dark:text-zinc-400"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-black dark:border-zinc-600 dark:bg-black dark:text-white sm:text-sm"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Join early access
          </Button>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="https://discord.gg/5nwrvt3JH2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
              >
                <Discord className="h-6 w-6" />
              </Link>
              <Link
                href="https://github.com/nizzyabi/Mail0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
              >
                <GitHub className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/NizzyABI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.youtube.com/@NizzyABI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
              >
                <YouTube className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-zinc-400">
          Are you developing?{" "}
          <Link href="/mail" className="underline">
            Go here
          </Link>
        </p>
      </div>
    </div>
  );
}
