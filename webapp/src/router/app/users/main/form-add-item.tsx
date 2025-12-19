import { useState, useEffect, useCallback } from "react";
import { LoaderCircle, AlertCircle } from "lucide-react";

import { useUser } from "@/lib/hooks/useUser";
import { useRole } from "@/lib/hooks/useRole";
import { isEmail } from "@/lib/utils/validator";
import { getErrorMessage } from "@/lib/utils/error";
import type { Role } from "@/lib/types/role";

import { Input } from "@/components/ui/input";
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

interface FieldAddItem {
    email: string;
    fullName: string;
    role: string;
}

const initialFields: FieldAddItem = {
    email: "",
    fullName: "",
    role: "",
};

interface FieldAddItemProps {
    closeDialog?: () => void;
}

export function FormAddItem({ closeDialog }: FieldAddItemProps) {
    const { createUser, refetchUsers } = useUser();

    const [fields, setFields] = useState<FieldAddItem>(initialFields);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFields(prev => ({ ...prev, [name]: value }));
    };

    const saveRole = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isFormLoading) {
            return;
        }

        setError("");

        if (fields.email === "") {
            setError("Email is required");
            return;
        } else if (!isEmail(fields.email)) {
            setError("Email format is invalid");
            return;
        }

        if (fields.fullName === "") {
            setError("Full name is required");
            return;
        }

        if (fields.role === "") {
            setError("Select role");
            return;
        }

        setIsFormLoading(true);

        try {
            await createUser({
                email: fields.email,
                fullName: fields.fullName,
                role: parseInt(fields.role),
            });

            // refetch users
            refetchUsers();

            // show success message
            toast.success("User has been invited");

            // close dialog
            closeDialog?.();
        } catch (error) {
            console.error("Create role error:", error);
            setError(getErrorMessage(error) || "An unexpected error occurred during create role");
        } finally {
            setIsFormLoading(false);
        }
    }, [fields, isFormLoading, createUser, refetchUsers]);

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
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="inputEmail">Email</FieldLabel>
                    <Input
                        type="email"
                        id="inputEmail"
                        name="email"
                        className="h-10"
                        value={fields.email}
                        placeholder="e.g. john@example.com"
                        onChange={handleInputChange}
                        disabled={isFormLoading}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="inputName">Full Name</FieldLabel>
                    <Input
                        type="text"
                        id="inputName"
                        name="fullName"
                        className="h-10"
                        value={fields.fullName}
                        placeholder="e.g. John Doe"
                        onChange={handleInputChange}
                        disabled={isFormLoading}
                        required
                    />
                </Field>
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
                    Create User
                </Button>
            </DialogFooter>
        </form>
    );
}