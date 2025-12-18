import { Link } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";

import { useConfig } from "@/lib/hooks/useConfig";

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function AppSidebarHeader() {
    const { AppName, AppVersion } = useConfig();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                    <Link to="/app">
                        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        <div className="grid gap-1.5">
                            <span className="font-medium leading-none">{AppName}</span>
                            <span className="text-xs text-muted-foreground leading-none">v{AppVersion}</span>
                        </div>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}