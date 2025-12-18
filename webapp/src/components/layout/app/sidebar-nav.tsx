import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, ShieldUser, UserCheck } from "lucide-react";

import { cn } from "@/lib/shadcn/utils";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebarNav() {
    const [pathname, setPathname] = useState<string>("");
    const location = useLocation();

    useEffect(() => {
        setPathname(location.pathname);
    }, [location.pathname]);

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/app" className={cn(pathname === "/app" && "bg-muted")}>
                                <Home className="size-4" />
                                <span>Home</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>Admin only</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/app/roles" className={cn(pathname === "/app/roles" && "bg-muted")}>
                                <ShieldUser className="size-4" />
                                <span>Roles</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/app/users" className={cn(pathname === "/app/users" && "bg-muted")}>
                                <UserCheck className="size-4" />
                                <span>Users</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}