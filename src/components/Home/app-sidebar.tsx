"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { usePathname, useRouter } from "next/navigation"
import {  LayoutDashboardIcon, LogOut, Settings, UserCircle2Icon } from "lucide-react"
import { NavUser } from "./nav-user"
import { MdOutlineCategory } from "react-icons/md";
import { BsFillCollectionPlayFill } from "react-icons/bs";
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { useState } from "react"
import { toast } from "sonner"
import { logoutUser } from "@/Server/Auth/Index"

const data = {
    user: {
        channel: "Channel Name",
        name: "Moriningwood",
        email: "sana_afrin03@gmail.com",
        avatar: "/assets/logo.png",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboardIcon,
        },
        {
            title: "Category",
            url: "/category",
            icon: MdOutlineCategory,
        },
        {
            title: "Content",
            url: "/content",
            icon: BsFillCollectionPlayFill,
        },
        {
            title: "Creators",
            url: "/creators",
            icon: UserCircle2Icon,
        },
        {
            title: "Settings",
            url: "/settings",
            icon: Settings,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    // Add `isActive` based on current path for main nav
    const navItems = data.navMain.map((item) => ({
        ...item,
        isActive: pathname === item.url,
    }))
    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            const result = await logoutUser();

            if (result.success) {
                toast.success("Logged out successfully");
                router.push("/login");
                router.refresh();
            } else {
                toast.error("Failed to logout. Please try again.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("An error occurred during logout");
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Sidebar variant="inset" className="bg-[#24120C]" collapsible="icon"{...props}>
            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>
            <SidebarContent className="md:hidden flex">
                <NavUser user={data.user} />
            </SidebarContent>
            <SidebarFooter>
                <Button
                    variant="destructive"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2"
                >
                    {isLoggingOut ? (
                        <>
                            <Spinner className="text-sm" />
                            Signing out...
                        </>
                    ) : (
                        <>
                            Sign out <LogOut className="size-5" />
                        </>
                    )}
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}