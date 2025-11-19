"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type IconComponent = LucideIcon | IconType | string;

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon: IconComponent;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <NavItem key={item.title} item={item} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function NavItem({
    item,
}: {
    item: {
        title: string;
        url: string;
        icon: IconComponent;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    };
}) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(item.isActive || false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
            <SidebarMenuItem>
                {/* If item has subitems, make it a collapsible trigger */}
                {item.items?.length ? (
                    <>
                        <CollapsibleTrigger>
                            <SidebarMenuButton asChild tooltip={item.title}>
                                <div
                                    className={cn(
                                        "flex items-center gap-2 rounded-md px-4 py-5 text-sm font-medium w-full ",
                                        item.isActive
                                            ? "bg-[#36190F] text-[#FDD3C6] font-semibold"
                                            : "text-[#A47E72]"
                                    )}
                                >
                                    {typeof item.icon === "string" ? (
                                        <Image
                                            src={item.icon}
                                            alt={item.title}
                                            width={24}
                                            height={24}
                                            className="!w-6! !h-6!"
                                        />
                                    ) : (
                                        <item.icon
                                            size={24}
                                            className="text-xl text-inherit !w-6! !h-6!"
                                        />
                                    )}
                                    <span className="flex-1">{item.title}</span>
                                    <ChevronRight
                                        className={cn(
                                            "ml-auto transition-transform duration-200",
                                            isOpen && "rotate-90"
                                        )}
                                    />
                                </div>
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {item.items?.map((subItem) => {
                                    const isSubItemActive = pathname === subItem.url;
                                    return (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton asChild>
                                                <Link
                                                    href={subItem.url}
                                                    className={cn(
                                                        isSubItemActive && "bg-[#36190F] text-[#FDD3C6] font-semibold"
                                                    )}
                                                >
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    );
                                })}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </>
                ) : (
                    /* If no subitems, make it a regular link */
                    <SidebarMenuButton asChild tooltip={item.title}>
                        <Link
                            href={item.url}
                            className={cn(
                                "flex items-center gap-2 rounded-md px-4 py-5 text-base font-medium my-1",
                                item.isActive
                                    ? "bg-[#36190F] text-[#FDD3C6] font-semibold"
                                    : "text-[#A47E72]"
                            )}
                        >
                            {typeof item.icon === "string" ? (
                                <Image
                                    src={item.icon}
                                    alt={item.title}
                                    width={24}
                                    height={24}
                                    className="w-6! h-6!"
                                />
                            ) : (
                                <item.icon
                                    size={24}
                                    className="text-xl text-inherit w-6! h-6!"
                                />
                            )}
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                )}
            </SidebarMenuItem>
        </Collapsible>
    );
}