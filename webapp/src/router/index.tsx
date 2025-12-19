import { createRouter } from "@tanstack/react-router";

import { rootRoute, appRoute } from "./__root";

// auth routes
import { loginRoute } from "./auth/login";
import { forgotPasswordRoute } from "./auth/forgot-password";
import { resetPasswordRoute } from "./auth/reset-password";

// app routes
import { appMainRoute } from "./app/main";
import { appRolesRoute } from "./app/roles/main";
import { appUsersRoute } from "./app/users/main";
import { appAccountRoute } from "./app/account";

// register routes
const routeTree = rootRoute.addChildren([
    // auth
    loginRoute,
    forgotPasswordRoute,
    resetPasswordRoute,

    // app
    appRoute.addChildren([
        appMainRoute,
        appRolesRoute,
        appUsersRoute,
        appAccountRoute,
    ]),
]);

export const router = createRouter({
    routeTree,
    context: {
        auth: {
            token: null,
        },
    },
});