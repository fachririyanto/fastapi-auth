import { useEffect } from "react";
import { createRoute } from "@tanstack/react-router";

import { appRoute } from "@/router/__root";

import { useAppStore } from "@/components/layout/app/store";

function Page() {
    const { setStore } = useAppStore();
    
    useEffect(() => {
        setStore({
            pageTitle: "Users",
        });
    }, []);

    return (
        <h1>Users</h1>
    );
}

export const appUsersRoute = createRoute({
    path: "/users",
    component: Page,
    getParentRoute: () => appRoute,
});