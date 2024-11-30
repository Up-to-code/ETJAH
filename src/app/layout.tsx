import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Middleware from "@/components/middleware";

export const metadata: Metadata = {
  title: "CRM",
  description: "CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Middleware>
      <html lang="en">
        <body className={`  antialiased`}>
          <Navbar />
          {children}
        </body>
      </html>
    </Middleware>
  );
}
