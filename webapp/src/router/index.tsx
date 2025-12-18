import { createRouter } from "@tanstack/react-router";

import { rootRoute } from "./__root";

// auth routes
import { loginRoute } from "./auth/login";

// register routes
const routeTree = rootRoute.addChildren([
    // auth
    loginRoute,
]);

export const router = createRouter({
    routeTree,
    context: {
        auth: {
            token: null,
        },
    },
});