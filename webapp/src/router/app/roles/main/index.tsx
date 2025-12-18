import { useEffect } from "react";
import { createRoute } from "@tanstack/react-router";

import { appRoute } from "@/router/__root";

import { useAppStore } from "@/components/layout/app/store";

function Page() {
    const { setStore } = useAppStore();

    useEffect(() => {
        setStore({
            pageTitle: "Roles",
        });
    }, []);

    return (
        <h1>Roles</h1>
    );
}

export const appRolesRoute = createRoute({
    path: "/roles",
    component: Page,
    getParentRoute: () => appRoute,
});