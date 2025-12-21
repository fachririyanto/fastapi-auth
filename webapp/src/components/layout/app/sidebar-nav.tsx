import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, ShieldUser, UserCheck, Database } from "lucide-react";

import { useAuth } from "@/components/authenticator";
import { Capability } from "@/lib/types/capability";
import { cn } from "@/lib/shadcn/utils";
import { useAppStore } from "./store";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebarNav() {
    const { store, setStore } = useAppStore();
    const { menuAccess } = store;

    // get user role access
    const { roleAccess } = useAuth();

    useEffect(() => {
        if (roleAccess) {
            if (roleAccess.length > 0) {
                const canAccessRole = roleAccess.find(access => access === Capability.readRole) ? true : false;
                const canAccessUser = roleAccess.find(access => access === Capability.readUser) ? true : false;

                // custom modules
                const canAccessSandbox = roleAccess.find(access => access === Capability.readSandbox) ? true : false;

                setStore(prev => ({
                    ...prev,
                    isLoadingMenuAccess: false,
                    menuAccess: {
                        ...prev.menuAccess,
                        canAccessRole,
                        canAccessUser,
                        canAccessSandbox,
                    },
                }));
            } else {
                setStore(prev => ({
                    ...prev,isLoadingMenuAccess: false,
                }));
            }
        }
    }, [roleAccess]);

    // get pathname
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
                    {
                        menuAccess.canAccessSandbox && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to="/app/sandbox" className={cn((pathname === "/app/sandbox" || pathname.startsWith("/app/sandbox")) && "bg-muted")}>
                                        <Database className="size-4" />
                                        <span>Sandbox</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }
                </SidebarMenu>
            </SidebarGroup>
            {
                (menuAccess.canAccessRole || menuAccess.canAccessUser) && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Admin only</SidebarGroupLabel>
                        <SidebarMenu>
                            {
                                menuAccess.canAccessRole && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link to="/app/roles" className={cn((pathname === "/app/roles" || pathname.startsWith("/app/roles")) && "bg-muted")}>
                                                <ShieldUser className="size-4" />
                                                <span>Roles</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            }
                            {
                                menuAccess.canAccessUser && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link to="/app/users" className={cn((pathname === "/app/users" || pathname.startsWith("/app/users")) && "bg-muted")}>
                                                <UserCheck className="size-4" />
                                                <span>Users</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            }
                        </SidebarMenu>
                    </SidebarGroup>
                )
            }
        </>
    );
}