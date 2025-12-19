import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components";

export const metadata: Metadata = {
  title: "StreamWeaver Dashboard",
  description: "Real-time streaming balance visibility for Celo payment streams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
