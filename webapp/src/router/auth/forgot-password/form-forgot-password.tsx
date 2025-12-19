import { useState, useCallback } from "react";
import { LoaderCircle, AlertCircle, CheckCircle } from "lucide-react";

import { useAccount } from "@/lib/hooks/useAccount";
import { isEmail } from "@/lib/utils/validator";
import { getErrorMessage } from "@/lib/utils/error";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface FieldForgotPassword {
    email: string;
}

const initialFields: FieldForgotPassword = {
    email: "",
};

export function FormForgotPassword() {
    const { forgotPassword } = useAccount();

    const [fields, setFields] = useState<FieldForgotPassword>(initialFields);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const resetPassword = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) {
            return;
        }

        setError(null);
        setSuccess(null);

        if (fields.email.trim() === "") {
            setError("Email is required");
            return;
        } else if (!isEmail(fields.email)) {
            setError("Email is not valid");
            return;
        }

        setIsLoading(true);

        try {
            await forgotPassword(fields);

            // show success message
            setSuccess("Link sent, check your email");
        } catch (error) {
            console.error("Login error:", error);
            setError(getErrorMessage(error) || "An unexpected error occurred during login");
        } finally {
            setIsLoading(false);

            // clear fields
            setFields(initialFields);
        }
    }, [fields, initialFields, isLoading, isEmail, forgotPassword]);

    return (
        <form onSubmit={resetPassword}>
            {error && (
                <Alert variant="destructive" className="mb-4 border-red-100 bg-red-50">
                    <AlertCircle />
                    <AlertTitle>{error}</AlertTitle>
                </Alert>
            )}
            {success && (
                <Alert className="mb-4 border-green-100 bg-green-50">
                    <CheckCircle className="!text-green-600" />
                    <AlertTitle className="text-green-700">{success}</AlertTitle>
                </Alert>
            )}
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
                    <Button
                        type="submit"
                        className="h-10"
                        disabled={isLoading}
                        >
                        {isLoading && <LoaderCircle className="animate-spin" />}
                        Send Reset Link
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}