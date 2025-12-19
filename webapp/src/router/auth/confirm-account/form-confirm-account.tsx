import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { LoaderCircle, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

import { useAccount } from "@/lib/hooks/useAccount";
import { isEmail } from "@/lib/utils/validator";
import { getErrorMessage } from "@/lib/utils/error";
import { confirmAccountRoute } from ".";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface FieldConfirmAccount {
    email: string;
    verifyCode: string;
    password: string;
    confirmPassword: string;
}

const initialFields: FieldConfirmAccount = {
    email: "",
    verifyCode: "",
    password: "",
    confirmPassword: "",
};

export function FormConfirmAccount() {
    const { confirmAccount } = useAccount();

    const [fields, setFields] = useState<FieldConfirmAccount>(initialFields);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // get email from url
    const params = confirmAccountRoute.useSearch();
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

    const verifyAccount = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
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

        if (fields.verifyCode.trim() === "") {
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
            await confirmAccount(fields);

            // show success message
            setSuccess("Account confirmed, please login to continue");
        } catch (error) {
            console.error("Confirm account error:", error);
            setError(getErrorMessage(error) || "An unexpected error occurred during confirm account");
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
    }, [fields, initialFields, isLoading, isEmail, confirmAccount]);

    return (
        <form onSubmit={verifyAccount}>
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
                    <FieldLabel htmlFor="inputCode">Code</FieldLabel>
                    <Input
                        id="inputCode"
                        type="password"
                        name="verifyCode"
                        placeholder="Enter code"
                        value={fields.verifyCode}
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
                        Verify Account
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}