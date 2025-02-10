import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "@/providers/providers";
import { siteConfig } from "@/config/site-config";
import { Toast } from "@/components/ui/toast";
import type { Metadata } from "next";
import "./globals.css";

import MailComposeModal from "@/components/mail/mail-compose-modal";
import { getLocale, getMessages } from "next-intl/server";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <NuqsAdapter>
              <Suspense>
                <MailComposeModal />
              </Suspense>
              {children}
            </NuqsAdapter>
          </Providers>
          <Toaster position="top-center" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
