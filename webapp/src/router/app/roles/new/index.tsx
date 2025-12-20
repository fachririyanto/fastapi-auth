import { useState, useEffect } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { appRoute } from "@/router/__root";
import { useAuth } from "@/components/authenticator";
import { useAppStore } from "@/components/layout/app/store";
import { Capability } from "@/lib/types/capability";

import { Skeleton } from "@/components/ui/skeleton";
import { FormAddItem } from "./form-add-item";

function Page() {
    const { store, setStore } = useAppStore();
    const [canAddItem, setCanAddItem] = useState<boolean>(false);

    useEffect(() => {
        setStore(prev => ({
            ...prev,
            pageTitle: "Roles",
        }));
    }, []);

    // load role access
    const { roleAccess } = useAuth();

    useEffect(() => {
        if (roleAccess && roleAccess.length > 0) {
            setCanAddItem(
                roleAccess.find(access => access === Capability.createRole) ? true : false
            );
        }
    }, [roleAccess]);

    if (store.isLoadingMenuAccess) {
        return (
            <Skeleton className="h-6 bg-muted rounded" />
        );
    }

    if (!canAddItem) {
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
        <section>
            <Link to="/app/roles" className="inline-flex gap-1 mb-4 text-sm items-center leading-snug">
                <ArrowLeft size={16} />
                Back
            </Link>
            <header className="mb-6">
                <h1 className="font-semibold text-2xl tracking-tight leading-tight">
                    Create New Role
                </h1>
                <p className="text-sm text-muted-foreground">Create new role in platform.</p>
            </header>
            <div className="max-w-[800px]">
                <FormAddItem />
            </div>
        </section>
    );
}

export const appNewRoleRoute = createRoute({
    path: "/roles/new",
    component: Page,
    getParentRoute: () => appRoute,
});