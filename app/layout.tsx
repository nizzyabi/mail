import { CommandMenu } from "@/components/ui/command-menu";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers/providers";
import { siteConfig } from "@/config/site-config";
import type { Metadata } from "next";
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
          <AppSidebar />
          {children}
          <CommandMenu />
        </Providers>
      </body>
    </html>
  );
}
