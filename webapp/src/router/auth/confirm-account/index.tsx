import { createRoute, Link, redirect } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";

import { rootRoute } from "@/router/__root";
import { useConfig } from "@/lib/hooks/useConfig";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { FormConfirmAccount } from "./form-confirm-account";

function Page() {
    const { AppName } = useConfig();

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link to="/" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    {AppName}
                </Link>
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">
                                Confirm account
                            </CardTitle>
                            <CardDescription className="px-2">
                                Create your password and verify your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormConfirmAccount />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export const confirmAccountRoute = createRoute({
    path: "/confirm-account",
    component: Page,
    getParentRoute: () => rootRoute,
    beforeLoad: async ({ context }) => {
        if (context.auth.token) {
            throw redirect({
                to: "/app",
            });
        }
    },
});