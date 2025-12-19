import { useEffect } from "react";
import { createRoute } from "@tanstack/react-router";

import { appRoute } from "@/router/__root";
import { useAppStore } from "@/components/layout/app/store";

function Page() {
    const { setStore } = useAppStore();
    
    useEffect(() => {
        setStore(prev => ({
            ...prev,
            pageTitle: "Home",
        }));
    }, []);

    return (
        <h1>Welcome to the App</h1>
    );
}

export const appMainRoute = createRoute({
    path: "/",
    component: Page,
    getParentRoute: () => appRoute,
});