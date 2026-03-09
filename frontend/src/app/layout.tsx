import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const appFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartQ",
  description: "SmartQ banking queue experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={appFont.variable}>{children}</body>
    </html>
  );
}
