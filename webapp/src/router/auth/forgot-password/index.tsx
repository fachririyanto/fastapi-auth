import { createRoute, Link, redirect } from "@tanstack/react-router";
import { GalleryVerticalEnd, ArrowLeft } from "lucide-react";

import { rootRoute } from "@/router/__root";
import { useConfig } from "@/lib/hooks/useConfig";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";

import { FormForgotPassword } from "./form-forgot-password";

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
                                Forgot password
                            </CardTitle>
                            <CardDescription className="px-2">
                                Enter your email associated with your account and we will send you a link to reset your password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormForgotPassword />
                        </CardContent>
                        <CardFooter>
                            <p className="w-full text-center">
                            <Link to="/" className="inline-flex gap-1 text-sm leading-none items-center">
                                <ArrowLeft size={16} />
                                Back to login
                            </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export const forgotPasswordRoute = createRoute({
    path: "/forgot-password",
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