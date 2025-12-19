import { useEffect } from "react";
import { createRoute } from "@tanstack/react-router";

import { appRoute } from "@/router/__root";
import { useAppStore } from "@/components/layout/app/store";

import { Skeleton } from "@/components/ui/skeleton";

function Page() {
    const { store, setStore } = useAppStore();

    useEffect(() => {
        setStore(prev => ({
            ...prev,
            pageTitle: "Roles",
        }));
    }, []);

    if (store.isLoadingMenuAccess) {
        return (
            <Skeleton className="h-6 bg-muted rounded" />
        );
    }

    if (!store.menuAccess.canAccessRole) {
        return (
            <p className="text-sm">
                Forbidden access to access this menu.
            </p>
        );
    }

    return <PageOutlet />;
}

function PageOutlet() {
    return (
        <h1>Roles</h1>
    );
}

export const appRolesRoute = createRoute({
    path: "/roles",
    component: Page,
    getParentRoute: () => appRoute,
});