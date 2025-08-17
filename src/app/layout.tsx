import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "b2bMarket",
  description: "b2b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
