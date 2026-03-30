import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartQ Banking Portal",
  description: "Secure banking queue and access portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
