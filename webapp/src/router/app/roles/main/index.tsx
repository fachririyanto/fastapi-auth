import { useEffect } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { appRoute } from "@/router/__root";
import { useAuth } from "@/components/authenticator";
import { useAppStore } from "@/components/layout/app/store";
import { Capability } from "@/lib/types/capability";
import { useLocalStore } from "./store";

import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";

import { Items } from "./items";

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
    const { localStore, setLocalStore } = useLocalStore();

    // define role access
    const { roleAccess } = useAuth();

    useEffect(() => {
        if (roleAccess && roleAccess.length > 0) {
            const canAddItem = roleAccess.find(access => access === Capability.createRole) ? true : false;
            const canEditItem = roleAccess.find(access => access === Capability.updateRole) ? true : false;
            const canDeleteItem = roleAccess.find(access => access === Capability.deleteRole) ? true : false;

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
                        Roles
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Setup roles in platform.
                    </p>
                </div>
                {
                    localStore.capability.canAddItem && (
                        <Link to="/app/roles/new" className={buttonVariants({})}>
                            <Plus />
                            New Role
                        </Link>
                    )
                }
            </header>
            <Items />
        </section>
    );
}

export const appRolesRoute = createRoute({
    path: "/roles",
    component: Page,
    getParentRoute: () => appRoute,
});