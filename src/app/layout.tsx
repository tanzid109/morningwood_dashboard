import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/Provider/Providers";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Morningwood",
  description: "Created by Tanzid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Providers>
      <html lang="en">
        <body className={`${sora.variable} antialiased`}>
          <div>
            {children}
          </div>
          <Toaster position="top-center" />
        </body>
      </html>
    </Providers>

  );
}
