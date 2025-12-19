import { useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { LoaderCircle, AlertCircle } from "lucide-react";

import { useAuth } from "@/components/authenticator";
import { isEmail } from "@/lib/utils/validator";
import { getErrorMessage } from "@/lib/utils/error";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface FieldLogin {
    email: string;
    password: string;
}

const initialFields: FieldLogin = {
    email: "",
    password: "",
};

export function FormLogin() {
    const { signIn } = useAuth();

    const [fields, setFields] = useState<FieldLogin>(initialFields);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const doLogin = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) {
            return;
        }

        setError(null);

        if (fields.email.trim() === "") {
            setError("Email is required");
            return;
        } else if (!isEmail(fields.email)) {
            setError("Email is not valid");
            return;
        }

        if (fields.password.trim() === "") {
            setError("Password is required");
            return;
        }

        setIsLoading(true);

        try {
            await signIn(fields.email, fields.password);

            // redirect to /app
            window.location.href = "/app";
        } catch (error) {
            console.error("Login error:", error);
            setError(getErrorMessage(error) || "An unexpected error occurred during login");
        } finally {
            setIsLoading(false);
        }
    }, [fields, isLoading]);

    return (
        <form onSubmit={doLogin}>
            {
                error && (
                    <Alert variant="destructive" className="mb-4 border-red-100 bg-red-50">
                        <AlertCircle />
                        <AlertDescription className="leading-snug">{error}</AlertDescription>
                    </Alert>
                )
            }
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="inputEmail">Email</FieldLabel>
                    <Input
                        id="inputEmail"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={fields.email}
                        className="h-10"
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                    />
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="inputPassword">Password</FieldLabel>
                        <Link
                            to="/forgot-password"
                            className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline"
                            >
                            Forgot your password?
                        </Link>
                    </div>
                    <Input
                        id="inputPassword"
                        type="password"
                        name="password"
                        value={fields.password}
                        className="h-10"
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                    />
                </Field>
                <Field>
                    <Button
                        type="submit"
                        className="h-10"
                        disabled={isLoading}
                        >
                        {isLoading && <LoaderCircle className="animate-spin" />}
                        Login
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}