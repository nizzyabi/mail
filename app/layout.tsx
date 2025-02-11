import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers/providers";
import { siteConfig } from "@/config/site-config";
import { Toast } from "@/components/ui/toast";
import type { Metadata } from "next";
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
        <NuqsAdapter>
          <Providers attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <Suspense>
              <MailComposeModal />
            </Suspense>
            {children}
            <Toast />
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
