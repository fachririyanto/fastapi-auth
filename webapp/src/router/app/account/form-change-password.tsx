import { useState, useCallback } from "react";
import { LoaderCircle, AlertCircle, CheckCircle } from "lucide-react";

import { useAccount } from "@/lib/hooks/useAccount";
import { getErrorMessage } from "@/lib/utils/error";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function FormChangePassword() {
    const { changePassword } = useAccount();

    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const saveProfile = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) {
            return;
        }

        setError("");
        setSuccess("");

        if (oldPassword === "") {
            setError("Old password is required");
            return;
        }

        if (newPassword === "") {
            setError("New password is required");
            return;
        }

        if (confirmPassword === "") {
            setError("Confirm password is required");
            return;
        } else if (confirmPassword !== newPassword) {
            setError("Confirm password is invalid");
            return;
        }

        setIsLoading(true);

        try {
            await changePassword({
                oldPassword,
                newPassword,
                confirmPassword,
            });

            // show success message
            setSuccess("Password changed");
        } catch (error) {
            console.error("Change password error:", error);
            setError(getErrorMessage(error) || "An unexpected error occurred during change password");
        } finally {
            setIsLoading(false);

            // clear form
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    }, [oldPassword, newPassword, confirmPassword, isLoading, changePassword]);

    return (
        <form onSubmit={saveProfile}>
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
                            {success}
                        </AlertDescription>
                    </Alert>
                )
            }
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="inputOldPassword" className="font-normal">Old Password</FieldLabel>
                    <Input
                        id="inputOldPassword"
                        type="password"
                        value={oldPassword}
                        className="h-10"
                        onChange={(e) => setOldPassword(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="inputNewPassword" className="font-normal">New Password</FieldLabel>
                    <Input
                        id="inputNewPassword"
                        type="password"
                        value={newPassword}
                        className="h-10"
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="inputConfirmPassword" className="font-normal">Confirm Password</FieldLabel>
                    <Input
                        id="inputConfirmPassword"
                        type="password"
                        value={confirmPassword}
                        className="h-10"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                </Field>
            </FieldGroup>
            <div className="flex mt-6 justify-end">
                <Button
                    type="submit"
                    className="h-10"
                    disabled={isLoading}
                    >
                    {isLoading && <LoaderCircle className="animate-spin" />}
                    Update Password
                </Button>
            </div>
        </form>
    );
}