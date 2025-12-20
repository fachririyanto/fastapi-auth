import { useState, useCallback } from "react";

import { useAuth } from "@/components/authenticator";
import { useUser } from "@/lib/hooks/useUser";
import type { User } from "@/lib/types/user";
import { isSuperAdmin } from "@/lib/utils/user";
import { getErrorMessage } from "@/lib/utils/error";

import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ButtonChangeStatusProps {
    item: User;
}

export function ButtonChangeStatus({ item }: ButtonChangeStatusProps) {
    const { user } = useAuth();
    const { changeStatus, refetchUsers } = useUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const changeUserStatus = useCallback(async (val: boolean) => {
        if (isLoading) {
            return;
        }

        try {
            await changeStatus({
                userId: item.user_id,
                isActive: val,
            });

            // refetch users
            refetchUsers();

            // show success message
            toast.success("User status has been changed");
        } catch (error) {
            console.error("Change user status error:", error);
            toast.error(getErrorMessage(error) || "An unexpected error occurred during change user status");
        } finally {
            setIsLoading(false);
        }
    }, [item.user_id, isLoading, changeStatus, refetchUsers]);

    return (
        <Switch
            checked={item.is_active}
            onCheckedChange={changeUserStatus}
            disabled={isLoading || isSuperAdmin(item.user_id) || user?.user_id === item.user_id}
        />
    );
}