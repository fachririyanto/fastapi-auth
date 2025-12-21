import { createRouter } from "@tanstack/react-router";

import { rootRoute, appRoute } from "./__root";

// auth routes
import { loginRoute } from "./auth/login";
import { forgotPasswordRoute } from "./auth/forgot-password";
import { resetPasswordRoute } from "./auth/reset-password";
import { confirmAccountRoute } from "./auth/confirm-account";

// app routes
import { appMainRoute } from "./app/main";
import { appAccountRoute } from "./app/account";
import { appRolesRoute } from "./app/roles/main";
import { appNewRoleRoute } from "./app/roles/new";
import { appEditRoleRoute } from "./app/roles/edit";
import { appUsersRoute } from "./app/users/main";

// custom app routes
import { appSandboxRoute } from "./app/sandbox/main";

// register routes
const routeTree = rootRoute.addChildren([
    // auth
    loginRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
    confirmAccountRoute,

    // app
    appRoute.addChildren([
        appMainRoute,
        appAccountRoute,
        appRolesRoute,
        appNewRoleRoute,
        appEditRoleRoute,
        appUsersRoute,
        appSandboxRoute,
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