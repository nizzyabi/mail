import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers/providers";
import { siteConfig } from "@/config/site-config";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

import MailComposeModal from "@/components/mail/mail-compose-modal";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NuqsAdapter>
            <Suspense>
              <MailComposeModal />
            </Suspense>
            {children}
          </NuqsAdapter>
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
