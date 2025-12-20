import { useState, useEffect, useCallback } from "react";
import { LoaderCircle, AlertCircle } from "lucide-react";

import { useUser } from "@/lib/hooks/useUser";
import { useRole } from "@/lib/hooks/useRole";
import { getErrorMessage } from "@/lib/utils/error";
import type { User } from "@/lib/types/user";
import type { Role } from "@/lib/types/role";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface FieldChangeRole {
    role: string;
}

interface FieldChangeRoleProps {
    item: User;
    closeDialog?: () => void;
}

export function FormChangeRole({ item, closeDialog }: FieldChangeRoleProps) {
    const { changeRole, refetchUsers } = useUser();

    const [fields, setFields] = useState<FieldChangeRole>({ role: item.role_id.toString() });
    const [roleOptions, setRoleOptions] = useState<Role[]>([]);
    const [isFormLoading, setIsFormLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // load roles
    const { getRoles } = useRole();
    const roles = getRoles({ limit: -1 });

    useEffect(() => {
        if (roles.data) {
            setRoleOptions(roles.data.roles);
        }
        setIsFormLoading(roles.isLoading);
    }, [roles.data, roles.isLoading]);

    const saveRole = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isFormLoading) {
            return;
        }

        setError("");

        if (fields.role === "") {
            setError("Select role");
            return;
        }

        setIsFormLoading(true);

        try {
            await changeRole({
                userId: item.user_id,
                roleId: parseInt(fields.role),
            });

            // refetch users
            refetchUsers();

            // show success message
            toast.success("User role has been changed");

            // close dialog
            closeDialog?.();
        } catch (error) {
            console.error("Update user role error:", error);
            setError(getErrorMessage(error) || "An unexpected error occurred during update user role");
        } finally {
            setIsFormLoading(false);
        }
    }, [item.user_id, fields, isFormLoading, changeRole, refetchUsers]);

    return (
        <form onSubmit={saveRole}>
            {
                error && (
                    <Alert variant="destructive" className="mb-4 border-red-100 bg-red-50">
                        <AlertCircle />
                        <AlertDescription className="leading-snug">{error}</AlertDescription>
                    </Alert>
                )
            }
            <FieldGroup className="gap-5">
                <Field>
                    <FieldLabel htmlFor="inputRole">Role</FieldLabel>
                    <Select
                        value={fields.role}
                        onValueChange={(val) => {
                            setFields(prev => ({ ...prev, role: val.trim() }));
                        }}
                        disabled={isFormLoading}
                        >
                        <SelectTrigger className="!h-10">
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value=" ">
                                Select Role
                            </SelectItem>
                            {
                                roleOptions.map((item, key) => (
                                    <SelectItem value={`${item.role_id}`} key={key}>
                                        {item.role_name}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </Field>
            </FieldGroup>
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
                    disabled={isFormLoading}
                    >
                    {isFormLoading && <LoaderCircle className="animate-spin" />}
                    Update Role
                </Button>
            </DialogFooter>
        </form>
    );
}