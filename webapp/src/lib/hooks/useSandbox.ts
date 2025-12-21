import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Sandbox } from "@/lib/types/sandbox";
import { useConfig, useConfigQuery } from "./useConfig";
import { useApi } from "./useApi";

export interface GetSandboxesResponse {
    sandboxes: Sandbox[];
    count: number;
}

export interface GetSandboxResponse {
    sandbox: Sandbox;
}

export const useSandbox = () => {
    const api = useApi();
    const { APIUrl } = useConfig();
    const queryClient = useQueryClient();

    const {
        retry,
        staleTime,
        refetchOnReconnect,
        refetchOnWindowFocus,
    } = useConfigQuery();

    // get list of sandbox
    const getSandboxes = ({
        search = "",
        page = 1,
        limit = 10,
    }: {
        search?: string;
        page?: number;
        limit?: number;
    } = {}) => {
        return useQuery({
            queryKey: ["get_sandboxes", search, page, limit],
            queryFn: async () => {
                const response = await api.GET<GetSandboxesResponse>(
                    `${APIUrl}/sandbox/list?search=${search}&page=${page}&limit=${limit}`
                );

                return response.data;
            },
            enabled: page > 0,
            retry,
            staleTime,
            refetchOnReconnect,
            refetchOnWindowFocus,
        });
    };

    // get sandbox detail
    const getSandbox = (sandboxId: number) => {
        return useQuery({
            queryKey: ["get_sandbox", sandboxId],
            queryFn: async () => {
                const response = await api.GET<GetSandboxResponse>(
                    `${APIUrl}/sandbox/detail/${sandboxId}`
                );

                return response.data;
            },
            enabled: sandboxId > 0,
            retry,
            staleTime,
            refetchOnReconnect,
            refetchOnWindowFocus,
        });
    };

    // create sandbox
    const createSandbox = async ({
        sandboxName,
    }: {
        sandboxName: string;
    }) => {
        const response = await api.POST(
            `${APIUrl}/sandbox/create`,
            {
                sandbox_name: sandboxName,
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // update sandbox
    const updateSandbox = async ({
        sandboxId,
        sandboxName,
    }: {
        sandboxId: number;
        sandboxName: string;
    }) => {
        const response = await api.PATCH(
            `${APIUrl}/sandbox/update`,
            {
                sandbox_id: sandboxId,
                sandbox_name: sandboxName,
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // delete sandbox
    const deleteSandbox = async (sandboxId: number) => {
        const response = await api.DELETE(
            `${APIUrl}/sandbox/delete`,
            {
                data: {
                    sandbox_id: sandboxId,
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // refetch list of sandboxes
    const refetchSandboxes = () => {
        queryClient.invalidateQueries({
            queryKey: ["get_sandboxes"],
        });
    };

    // refetch detail sandbox
    const refetchSandbox = (sandboxId: number) => {
        queryClient.invalidateQueries({
            queryKey: ["get_sandbox", sandboxId],
        });
    };

    return {
        getSandboxes,
        getSandbox,
        updateSandbox,
        createSandbox,
        deleteSandbox,
        refetchSandboxes,
        refetchSandbox,
    };
};