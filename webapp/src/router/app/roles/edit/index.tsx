import { useState, useEffect } from "react";
import { createRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { appRoute } from "@/router/__root";
import { useAuth } from "@/components/authenticator";
import { useAppStore } from "@/components/layout/app/store";
import { useRole } from "@/lib/hooks/useRole";
import { Capability } from "@/lib/types/capability";
import type { Role } from "@/lib/types/role";

import { Skeleton } from "@/components/ui/skeleton";
import { FormEditItem } from "./form-edit-item";

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
                roleAccess.find(access => access === Capability.updateRole) ? true : false
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
    const { roleId } = appEditRoleRoute.useParams();

    const { getRole } = useRole();
    const roleDetail = getRole(parseInt(roleId), true);
    const [role, setRole] = useState<Role | null>(null);
    const [capabilities, setCapabilities] = useState<string[]>([]);

    useEffect(() => {
        if (roleDetail.data) {
            setRole(roleDetail.data.role);

            if (roleDetail.data.capabilities) {
                setCapabilities(roleDetail.data.capabilities);
            }
        }
    }, [roleDetail.data]);

    if (roleDetail.isError) {
        return (
            <p className="text-sm">
                Failed to load data.
            </p>
        );
    }

    if (roleDetail.isLoading) {
        return (
            <Skeleton className="h-6 bg-muted rounded" />
        );
    }

    return (
        <section>
            <Link to="/app/roles" className="inline-flex gap-1 mb-4 text-sm items-center leading-snug">
                <ArrowLeft size={16} />
                Back
            </Link>
            <header className="mb-6">
                <h1 className="font-semibold text-2xl tracking-tight leading-tight">
                    Edit Role
                </h1>
                <p className="text-sm text-muted-foreground">Update role details in platform.</p>
            </header>
            <div className="max-w-[800px]">
                {role && <FormEditItem item={role} currentCapabilities={capabilities} />}
            </div>
        </section>
    );
}

export const appEditRoleRoute = createRoute({
    path: "/roles/edit/$roleId",
    component: Page,
    getParentRoute: () => appRoute,
});