import { useEffect } from "react";
import { createRoute } from "@tanstack/react-router";

import { appRoute } from "@/router/__root";
import { useAuth } from "@/components/authenticator";
import { useAppStore } from "@/components/layout/app/store";
import { Capability } from "@/lib/types/capability";
import { useLocalStore } from "./store";

import { Skeleton } from "@/components/ui/skeleton";
import { ButtonAddItem } from "./button-add-item";

import { FormSearchItem } from "./form-search-item";
import { Items } from "./items";

function Page() {
    const { store, setStore } = useAppStore();

    useEffect(() => {
        setStore(prev => ({
            ...prev,
            pageTitle: "Users",
        }));
    }, []);

    if (store.isLoadingMenuAccess) {
        return (
            <Skeleton className="h-6 bg-muted rounded" />
        );
    }

    if (!store.menuAccess.canAccessUser) {
        return (
            <p className="text-sm">
                Forbidden access to access this menu.
            </p>
        );
    }

    return <PageOutlet />;
}

function PageOutlet() {
    const { localStore, setLocalStore } = useLocalStore();

    // define role access
    const { roleAccess } = useAuth();

    useEffect(() => {
        if (roleAccess && roleAccess.length > 0) {
            const canAddItem = roleAccess.find(access => access === Capability.createUser) ? true : false;
            const canEditItem = roleAccess.find(access => access === Capability.updateUser) ? true : false;
            const canDeleteItem = roleAccess.find(access => access === Capability.deleteUser) ? true : false;

            setLocalStore(prev => ({
                ...prev,
                capability: {
                    canAddItem,
                    canEditItem,
                    canDeleteItem,
                },
            }));
        }
    }, [roleAccess, Capability]);

    return (
        <section>
            <header className="flex gap-4 mb-6 items-center">
                <div className="flex-grow">
                    <h1 className="font-semibold text-2xl tracking-tight leading-tight">
                        Users
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        List of users in platform.
                    </p>
                </div>
                {
                    localStore.capability.canAddItem && (
                        <ButtonAddItem />
                    )
                }
            </header>
            <div className="flex mb-4">
                <FormSearchItem />
            </div>
            <Items />
        </section>
    );
}

export const appUsersRoute = createRoute({
    path: "/users",
    component: Page,
    getParentRoute: () => appRoute,
});