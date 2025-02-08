import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";

import { Providers } from "@/providers/providers";
import { siteConfig } from "@/config/site-config";

import { CommandMenu } from "@/components/ui/command-menu";

import MailComposeModal from "@/components/mail/mail-compose-modal";
import "./globals.css";

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
            <MailComposeModal />
            {children}
          </NuqsAdapter>
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
