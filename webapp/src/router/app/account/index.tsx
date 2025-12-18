import { useEffect } from "react";
import { createRoute } from "@tanstack/react-router";

import { appRoute } from "@/router/__root";
import { useAppStore } from "@/components/layout/app/store";

import { FormEditProfile } from "./form-edit-profile";
import { FormChangePassword } from "./form-change-password";

function Page() {
    const { setStore } = useAppStore();

    useEffect(() => {
        setStore({
            pageTitle: "Account",
        });
    }, []);

    return (
        <section>
            <header className="mb-6">
                <h1 className="font-semibold text-2xl tracking-tight leading-tight">
                    Account
                </h1>
                <p className="text-sm text-muted-foreground">Update profile and change password.</p>
            </header>
            <div className="grid gap-6 max-w-[480px]">
                <div className="border rounded-lg">
                    <header className="p-4 border-b">
                        <h2 className="font-medium leading-tight">
                            Edit Profile
                        </h2>
                    </header>
                    <div className="p-4">
                        <FormEditProfile />
                    </div>
                </div>
                <div className="border rounded-lg">
                    <header className="p-4 border-b">
                        <h2 className="font-medium leading-tight">
                            Change Password
                        </h2>
                    </header>
                    <div className="p-4">
                        <FormChangePassword />
                    </div>
                </div>
            </div>
        </section>
    );
}

export const appAccountRoute = createRoute({
    path: "/account",
    component: Page,
    getParentRoute: () => appRoute,
});