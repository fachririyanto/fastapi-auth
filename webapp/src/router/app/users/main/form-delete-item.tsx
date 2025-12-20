import { useState, useCallback } from "react";
import { LoaderCircle, AlertCircle } from "lucide-react";

import { useUser } from "@/lib/hooks/useUser";
import type { User } from "@/lib/types/user";
import { getErrorMessage } from "@/lib/utils/error";

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface FormDeleteItemProps {
    item: User;
    closeDialog?: () => void;
}

export function FormDeleteItem({ item, closeDialog }: FormDeleteItemProps) {
    const { deleteUser, refetchUsers } = useUser();
    const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const deleteSelectedUser = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isFormLoading) {
            return;
        }

        setIsFormLoading(true);

        try {
            await deleteUser(item.user_id);

            // refetch users
            refetchUsers();

            // show success message
            toast.success("User has been deleted");

            // close dialog
            closeDialog?.();
        } catch (error) {
            console.error("Delete user error:", error);
            setError(getErrorMessage(error) || "An unexpected error occurred during delete user");
        } finally {
            setIsFormLoading(false);
        }
    }, [item.user_id, isFormLoading]);

    return (
        <form onSubmit={deleteSelectedUser}>
            {
                error && (
                    <Alert variant="destructive" className="mb-4 border-red-100 bg-red-50">
                        <AlertCircle />
                        <AlertDescription className="leading-snug">{error}</AlertDescription>
                    </Alert>
                )
            }
            <p className="text-sm text-muted-foreground leading-snug">
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </p>
            <DialogFooter className="mt-6">
                <DialogClose asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10"
                        disabled={isFormLoading}
                        >
                        Cancel
                    </Button>
                </DialogClose>
                <Button
                    type="submit"
                    className="h-10"
                    variant="destructive"
                    disabled={isFormLoading}
                    >
                    {isFormLoading && <LoaderCircle className="animate-spin" />}
                    Delete User
                </Button>
            </DialogFooter>
        </form>
    );
}