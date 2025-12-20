import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LoaderCircle, AlertCircle } from "lucide-react";

import { useRole } from "@/lib/hooks/useRole";
import type { Module } from "@/lib/types/capability";
import { getErrorMessage } from "@/lib/utils/error";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export function FormAddItem() {
    const navigate = useNavigate();

    const [modules, setModules] = useState<Module[]>([]);
    const [roleName, setRoleName] = useState<string>("");
    const [capabilities, setCapabilities] = useState<string[]>([]);
    const [isFormLoading, setIsFormLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // load role capabilities
    const { getRoleCapabilities, createRole, refetchRoles } = useRole();
    const roleCapabilities = getRoleCapabilities();

    useEffect(() => {
        if (roleCapabilities.data) {
            setModules(roleCapabilities.data.modules);
        }
        setIsFormLoading(roleCapabilities.isLoading);
    }, [roleCapabilities.data, roleCapabilities.isLoading]);

    const handleToggleCapability = (capId: string, checked: boolean) => {
        if (checked) {
            setCapabilities([...capabilities, capId]);
        } else {
            setCapabilities(
                capabilities.filter((item) => item !== capId)
            );
        }
    };

    const isItemChecked = (capId: string) => {
        return capabilities.find(item => item === capId) ? true : false;
    };

    const saveRole = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isFormLoading) {
            return;
        }

        setError("");

        if (roleName === "") {
            setError("Role name is required");
            return;
        }

        if (capabilities.length === 0) {
            setError("Capability is required");
            return;
        }

        setIsFormLoading(true);

        try {
            await createRole({
                roleName,
                capabilities,
            });

            // refetch roles
            refetchRoles();

            // show success message
            toast.success("Role has been created");

            // navigate to list roles page
            navigate({ to: `/app/roles` });
        } catch (error) {
            console.error("Create role error:", error);
            setError(getErrorMessage(error) || "An unexpected error occurred during create role");
        } finally {
            setIsFormLoading(false);
        }
    }, [roleName, capabilities, isFormLoading, createRole, refetchRoles]);

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
                    <FieldLabel htmlFor="inputRoleName">Role Name</FieldLabel>
                    <Input
                        type="text"
                        id="inputRoleName"
                        name="roleName"
                        placeholder="e.g. Member"
                        className="h-10"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel>Capabilities</FieldLabel>
                    <div className="grid gap-4 p-4 border rounded-lg">
                        {
                            modules.map((item, key) => (
                                <div className="p-4 border rounded-lg" key={key}>
                                    <h3 className="mb-3 font-medium text-sm leading-snug">
                                        {item.module_name}
                                    </h3>
                                    {
                                        item.capabilities.length > 0 && (
                                            <ul className="flex flex-wrap gap-x-6 gap-y-4">
                                                {
                                                    item.capabilities.map((cap) => (
                                                        <li key={cap.id}>
                                                            <Label>
                                                                <Checkbox
                                                                    value={cap.id}
                                                                    checked={isItemChecked(cap.id)}
                                                                    onCheckedChange={(checked: boolean) => handleToggleCapability(cap.id, checked)}
                                                                />
                                                                <span className="font-normal">{cap.name}</span>
                                                            </Label>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        )
                                    }
                                </div>
                            ))
                        }
                    </div>
                </Field>
            </FieldGroup>
            <div className="flex mt-6 justify-end">
                <Button
                    type="submit"
                    className="h-10"
                    disabled={isFormLoading}
                    >
                    {isFormLoading && <LoaderCircle className="animate-spin" />}
                    Create Role
                </Button>
            </div>
        </form>
    );
}