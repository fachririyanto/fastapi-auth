import { useState, useCallback } from "react";
import { LoaderCircle, AlertCircle } from "lucide-react";

import { useSandbox } from "@/lib/hooks/useSandbox";
import type { Sandbox } from "@/lib/types/sandbox";
import { getErrorMessage } from "@/lib/utils/error";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface FieldEditItem {
    sandboxName: string;
}

interface FormEditItemProps {
    item: Sandbox;
    closeDialog?: () => void;
}

export function FormEditItem({ item, closeDialog }: FormEditItemProps) {
    const { updateSandbox, refetchSandboxes, refetchSandbox } = useSandbox();

    const [fields, setFields] = useState<FieldEditItem>({ sandboxName: item.sandbox_name });
    const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFields(prev => ({ ...prev, [name]: value }));
    };

    const saveSandbox = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isFormLoading) {
            return;
        }

        setError("");

        if (fields.sandboxName === "") {
            setError("Sandbox name is required");
            return;
        }

        setIsFormLoading(true);

        try {
            await updateSandbox({
                sandboxId: item.sandbox_id,
                sandboxName: fields.sandboxName,
            });

            // refetch sandbox
            refetchSandboxes();
            refetchSandbox(item.sandbox_id);

            // show success message
            toast.success("Sandbox has been updated");

            // close dialog
            closeDialog?.();
        } catch (error) {
            console.error("Update sandbox error:", error);
            setError(getErrorMessage(error) || "An unexpected error occurred during update sandbox");
        } finally {
            setIsFormLoading(false);
        }
    }, [item.sandbox_id, fields, isFormLoading, updateSandbox, refetchSandboxes]);

    return (
        <form onSubmit={saveSandbox}>
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
                    <FieldLabel htmlFor="inputName">Sandbox Name</FieldLabel>
                    <Input
                        type="text"
                        id="inputName"
                        name="sandboxName"
                        className="h-10"
                        value={fields.sandboxName}
                        placeholder="e.g. Sand Name"
                        onChange={handleInputChange}
                        disabled={isFormLoading}
                        required
                    />
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
                    Update Sandbox
                </Button>
            </DialogFooter>
        </form>
    );
}