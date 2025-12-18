import { useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, ChevronsUpDown, LogOut, LoaderCircle } from "lucide-react";

import { useAuth } from "@/components/authenticator";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebarProfile() {
    const { isMobile } = useSidebar();
    const { user } = useAuth();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={``} alt={user?.full_name} />
                                <AvatarFallback className="text-background bg-foreground rounded-lg">
                                    {user?.full_name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user?.full_name}</span>
                                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                        >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={""} alt={user?.full_name} />
                                    <AvatarFallback className="text-background bg-foreground rounded-lg">
                                        {user?.full_name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user?.full_name}</span>
                                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Link to="/app/account">
                                <DropdownMenuItem>
                                    <BadgeCheck />
                                    Account
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <ButtonLogout />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

function ButtonLogout() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { signOut } = useAuth();

    const handleLogout = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            await signOut();

            // redirect to login page
            window.location.href = `/`;
        } catch (error) {
            console.error("Error during sign out:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, signOut]);

    return (
        <DropdownMenuItem
            onSelect={handleLogout}
            className="hover:!bg-red-50"
            disabled={isLoading}
            >
            {isLoading ? <LoaderCircle className="animate-spin text-red-900" /> : <LogOut className="text-red-900" />}
            <span className="text-red-900">Log out</span>
        </DropdownMenuItem>
    );
}