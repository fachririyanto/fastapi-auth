import { useState, useEffect, useCallback } from "react";
import { Monitor, LoaderCircle } from "lucide-react";

import { useAccount } from "@/lib/hooks/useAccount";
import { getErrorMessage } from "@/lib/utils/error";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Items() {
    const { getUserTokens } = useAccount();
    const userTokens = getUserTokens();

    const [userAgent, setUserAgent] = useState<string>("");

    useEffect(() => {
        setUserAgent(window.navigator.userAgent);
    }, []);

    if (userTokens.isError) {
        return (
            <p className="text-sm text-muted-foreground">
                Failed to load data.
            </p>
        );
    }

    if (userTokens.isLoading) {
        return (
            <Skeleton className="bg-muted h-4 rounded" />
        );
    }

    if (userTokens.data?.tokens.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No data found.
            </p>
        );
    }

    return (
        <div className="grid gap-4">
            <div className="grid gap-4">
                {
                    userTokens.data?.tokens.map((item, key) => (
                        <div className="flex gap-4 p-4 border rounded-lg" key={key}>
                            <Monitor size={28} className="min-w-[28px]" />
                            <div className="flex-grow">
                                <div className="grid gap-1">
                                    <p className="text-sm leading-snug">
                                        {item.user_agent}
                                    </p>
                                    <p className="text-xs text-muted-foreground leading-snug">
                                        {item.ip_address}. {userAgent === item.user_agent ? <span className="font-medium text-green-700">This device</span> : <>Created at {new Date(item.created_at).toLocaleString()}</>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="flex justify-end">
                <ButtonRevokeOtherSessions />
            </div>
        </div>
    );
}

function ButtonRevokeOtherSessions() {
    const { revokeOtherSessions, refetchUserTokens } = useAccount();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const revokeSessions = useCallback(async () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            await revokeOtherSessions();

            // refetch tokens
            refetchUserTokens();

            // show success message
            toast.success("Other sessions revoked");
        } catch (error) {
            console.error("Change password error:", error);
            toast.error(getErrorMessage(error) || "An unexpected error occurred during change password");
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, revokeOtherSessions, refetchUserTokens]);

    return (
        <Button
            type="button"
            onClick={revokeSessions}
            disabled={isLoading}
            >
            {isLoading && <LoaderCircle className="animate-spin" />}
            Logout other sessions
        </Button>
    );
}