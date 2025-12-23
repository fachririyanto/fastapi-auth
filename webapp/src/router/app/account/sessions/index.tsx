import { useEffect } from "react";
import { createRoute } from "@tanstack/react-router";

import { appRoute } from "@/router/__root";
import { useAppStore } from "@/components/layout/app/store";

import { Items } from "./items";

function Page() {
    const { setStore } = useAppStore();
    
    useEffect(() => {
        setStore(prev => ({
            ...prev,
            pageTitle: "Sessions",
        }));
    }, []);

    return (
        <section>
            <header className="mb-6">
                <h1 className="font-semibold text-2xl tracking-tight leading-tight">
                    Sessions
                </h1>
                <p className="text-sm text-muted-foreground">
                    If necessary, you may logout of all of your other browser sessions accross of all your devices.
                </p>
            </header>
            <div className="max-w-[480px]">
                <Items />
            </div>
        </section>
    );
}

export const appAccountSessionsRoute = createRoute({
    path: "/account/sessions",
    component: Page,
    getParentRoute: () => appRoute,
});