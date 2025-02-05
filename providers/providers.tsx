"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProviders } from "./session-provider";

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <SessionProviders>
    <NextThemesProvider {...props}>
      <SidebarProvider>{children}</SidebarProvider>
    </NextThemesProvider>
    </SessionProviders>
  );
}
