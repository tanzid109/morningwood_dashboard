import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { NavUserDesk } from "@/components/Home/nav-userDesk";
import Image from "next/image";
import Link from "next/link";
import { AppSidebar } from "@/components/Home/app-sidebar";

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

  const data = {
    user: {
      channel: "Channel Name",
      name: "Moriningwood",
      email: "sana_afrin03@gmail.com",
      avatar: "/assets/logo.png",
    },
  }

  return (
    <html lang="en">
      <body className={`${sora.variable} antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="sticky bg-[#24120C] top-0 z-50 backdrop-blur-xl flex flex-wrap justify-between items-center p-2 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-auto border-b border-[#5A392F]">
              <div className="flex items-center justify-center gap-3 px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="relative mx-auto w-16 h-16">
                  <Link href="/">
                    <Image
                      src="/assets/logo.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                <div className="hidden md:flex">
                  <NavUserDesk user={data.user} />
                </div>
              </div>
            </header>

            <main className="px-4 py-4">
              {children}
            </main>
          </SidebarInset>

          <Toaster position="top-center" />
        </SidebarProvider>
      </body>
    </html>
  );
}
