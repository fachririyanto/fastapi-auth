import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { LoaderCircle, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

import { useAccount } from "@/lib/hooks/useAccount";
import { isEmail } from "@/lib/utils/validator";
import { getErrorMessage } from "@/lib/utils/error";
import { resetPasswordRoute } from ".";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface FieldResetPassword {
    email: string;
    resetCode: string;
    password: string;
    confirmPassword: string;
}

const initialFields: FieldResetPassword = {
    email: "",
    resetCode: "",
    password: "",
    confirmPassword: "",
};

export function FormResetPassword() {
    const { resetPassword } = useAccount();

    const [fields, setFields] = useState<FieldResetPassword>(initialFields);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // get email from url
    const params = resetPasswordRoute.useSearch();
    const emailParam = params.email || "";

    useEffect(() => {
        setFields((prev) => ({
            ...prev,
            email: emailParam,
        }));
    }, [emailParam]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const confirmPassword = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
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

        if (fields.resetCode.trim() === "") {
            setError("Reset code is required");
            return;
        }

        if (fields.password.trim() === "") {
            setError("Password is required");
            return;
        }

        if (fields.confirmPassword.trim() === "") {
            setError("Confirm password is required");
            return;
        } else if (fields.password !== fields.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(fields);

            // show success message
            setSuccess("Password confirmed, please login to continue");
        } catch (error) {
            console.error("Login error:", error);
            setError(getErrorMessage(error) || "An unexpected error occurred during login");
        } finally {
            setIsLoading(false);

            // clear fields
            setFields(prev => ({
                ...prev,
                resetCode: "",
                password: "",
                confirmPassword: "",
            }));
        }
    }, [fields, initialFields, isLoading, isEmail, resetPassword]);

    return (
        <form onSubmit={confirmPassword}>
            {
                error && (
                    <Alert variant="destructive" className="mb-4 border-red-100 bg-red-50">
                        <AlertCircle />
                        <AlertDescription className="leading-snug">{error}</AlertDescription>
                    </Alert>
                )
            }
            {
                success && (
                    <Alert className="mb-4 border-green-100 bg-green-50">
                        <CheckCircle className="!text-green-600" />
                        <AlertDescription className="text-green-700 leading-snug">
                            {success}.
                            <Link to="/" className="inline-flex gap-1 mt-1 border-b border-green-600 items-center">
                                Login page
                                <ArrowRight size={16} />
                            </Link>
                        </AlertDescription>
                    </Alert>
                )
            }
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="inputCode">Reset Code</FieldLabel>
                    <Input
                        id="inputCode"
                        type="password"
                        name="resetCode"
                        placeholder="Enter code"
                        value={fields.resetCode}
                        className="h-10"
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="inputPassword">New Password</FieldLabel>
                    <Input
                        id="inputPassword"
                        type="password"
                        name="password"
                        placeholder="Enter new password"
                        value={fields.password}
                        className="h-10"
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="inputConfirmPassword">Confirm Password</FieldLabel>
                    <Input
                        id="inputConfirmPassword"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={fields.confirmPassword}
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
                        Confirm Password
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}