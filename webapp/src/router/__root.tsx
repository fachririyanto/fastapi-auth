import {
    Outlet,
    createRootRouteWithContext,
    createRoute,
    redirect,
} from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/app";

interface RootRouteContext {
    auth: {
        token: string | null;
    };
}

export const rootRoute = createRootRouteWithContext<RootRouteContext>()({
    component: Outlet,
    beforeLoad: async ({ context, location }) => {
        if (location.pathname.startsWith("/app")) {
            if (!context.auth.token) {
                throw redirect({
                    to: "/",
                });
            }
        }
    },
});

export const appRoute = createRoute({
    path: "/app",
    component: () => (<AppLayout><Outlet /></AppLayout>),
    getParentRoute: () => rootRoute,
});