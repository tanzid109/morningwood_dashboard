"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { usePathname } from "next/navigation"
import {  LayoutDashboardIcon, Settings, UserCircle2Icon } from "lucide-react"
import { NavUser } from "./nav-user"
import { MdOutlineCategory } from "react-icons/md";
import { BsFillCollectionPlayFill } from "react-icons/bs";

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

    // Add `isActive` based on current path for main nav
    const navItems = data.navMain.map((item) => ({
        ...item,
        isActive: pathname === item.url,
    }))


    return (
        <Sidebar variant="inset" className="bg-[#24120C]" collapsible="icon"{...props}>
            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>
            <SidebarFooter className="md:hidden flex">
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}