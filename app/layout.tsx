import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-Commerce Store",
  description:
    "Shop online with us and get quality products at a reasonable price.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Toaster richColors position="top-right" />
        <SessionProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
