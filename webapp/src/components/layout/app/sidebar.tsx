import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

import { AppSidebarHeader } from "./sidebar-header";
import { AppSidebarNav } from "./sidebar-nav";
import { AppSidebarProfile } from "./sidebar-profile";

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <AppSidebarHeader />
            </SidebarHeader>
            <SidebarContent>
                <AppSidebarNav />
            </SidebarContent>
            <SidebarFooter>
                <AppSidebarProfile />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}