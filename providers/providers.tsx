"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PostHogProvider } from "posthog-js/react";
import KeyboardProvider from "./keyboard";
import posthog from "posthog-js";
import { Provider } from "jotai";
import { Suspense } from "react";
import * as React from "react";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

export function Providers({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <Provider>
      <NextThemesProvider {...props}>
        <PostHogProvider client={posthog}>
          <SidebarProvider>
            <Suspense>
              <KeyboardProvider />
            </Suspense>
            {children}
          </SidebarProvider>
        </PostHogProvider>
      </NextThemesProvider>
    </Provider>
  );
}
