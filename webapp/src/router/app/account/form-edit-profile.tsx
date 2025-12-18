import { useState, useEffect, useCallback } from "react";
import { LoaderCircle, AlertCircle, CheckCircle } from "lucide-react";

import { useAuth } from "@/components/authenticator";
import { useAccount } from "@/lib/hooks/useAccount";
import { getErrorMessage } from "@/lib/utils/error";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertTitle } from "@/components/ui/alert";

export function FormEditProfile() {
    const { user, isProfileLoading } = useAuth();
    const { updateProfile, refetchProfile } = useAccount();

    const [fullName, setFullName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    useEffect(() => {
        if (user) {
            setFullName(user.full_name);
        }
        setIsLoading(isProfileLoading);
    }, [user, isProfileLoading]);

    const saveProfile = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) {
            return;
        }

        setError("");
        setSuccess("");

        if (fullName === "") {
            setError("Full name is required");
            return;
        }

        setIsLoading(true);

        try {
            await updateProfile({
                fullName,
            });

            // show success message
            setSuccess("Profile updated");

            // refetch profile
            refetchProfile();
        } catch (error) {
            console.error("Update profile error:", error);
            setError(getErrorMessage(error) || "An unexpected error occurred during update profile");
        } finally {
            setIsLoading(false);
        }
    }, [fullName, isLoading, updateProfile, refetchProfile]);

    return (
        <form onSubmit={saveProfile}>
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
                    <FieldLabel htmlFor="inputFullName" className="font-normal">Full Name</FieldLabel>
                    <Input
                        id="inputFullName"
                        type="text"
                        placeholder="e.g. John Doe"
                        value={fullName}
                        className="h-10"
                        onChange={(e) => setFullName(e.target.value)}
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
                    Update Profile
                </Button>
            </div>
        </form>
    );
}