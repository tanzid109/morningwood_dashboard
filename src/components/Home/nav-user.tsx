"use client"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LogOut, } from "lucide-react"
import Link from "next/link"
import { Spinner } from "../ui/spinner"

export function NavUser({
    user,
    onLogout,
    isLoggingOut = false
}: {
    user: {
        fullName: string
        email: string
        image: string
    }
    onLogout?: () => void
    isLoggingOut?: boolean
}) {
    // const { isMobile } = useSidebar()


    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            // size="sm"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-full">
                                <AvatarImage src={user.image} alt={user.fullName} />
                                <AvatarFallback className="rounded-lg">{user.fullName}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium text-[#FDD3C6]">{user.fullName}</span>
                                <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-2 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-16 w-16 rounded-full bg-amber-50">
                                    <AvatarImage src={user.image} alt={user.fullName} />
                                    <AvatarFallback className="rounded-lg">{user.fullName}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate text-sm">{user.fullName}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {user.email}
                                    </span>
                                    <Link href="/profile" className="border border-[#5A392F] text-center p-2 mt-2 rounded-full">
                                        Update Profile
                                    </Link>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-500 cursor-pointer"
                            onClick={onLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <>
                                    <Spinner className="text-red-500" />
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <LogOut className="text-red-500" />
                                    Log out
                                </>
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}