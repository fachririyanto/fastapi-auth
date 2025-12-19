import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Role } from "@/lib/types/role";
import { useConfig, useConfigQuery } from "./useConfig";
import { useApi } from "./useApi";

export interface GetRolesResponse {
    roles: Role[];
    count: number;
}

export interface GetRoleResponse {
    role: Role[];
}

export const useRole = () => {
    const api = useApi();
    const { APIUrl } = useConfig();
    const queryClient = useQueryClient();

    const {
        retry,
        staleTime,
        refetchOnReconnect,
        refetchOnWindowFocus,
    } = useConfigQuery();

    // get list of roles
    const getRoles = ({
        search = "",
        page = 1,
        limit = 10,
    }: {
        search?: string;
        page?: number;
        limit?: number;
    } = {}) => {
        return useQuery({
            queryKey: ["get_roles", search, page, limit],
            queryFn: async () => {
                const response = await api.GET<GetRolesResponse>(
                    `${APIUrl}/role/list?search=${search}&page=${page}&limit=${limit}`
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

    // get role detail
    const getRole = (roleId: number) => {
        return useQuery({
            queryKey: ["get_role", roleId],
            queryFn: async () => {
                const response = await api.GET<GetRoleResponse>(
                    `${APIUrl}/role/detail/${roleId}`
                );

                return response.data;
            },
            enabled: roleId > 0,
            retry,
            staleTime,
            refetchOnReconnect,
            refetchOnWindowFocus,
        });
    };

    // refetch list of roles
    const refetchRoles = () => {
        queryClient.invalidateQueries({
            queryKey: ["get_roles"],
        });
    };

    // refetch detail role
    const refetchRole = (roleId: number) => {
        queryClient.invalidateQueries({
            queryKey: ["get_role", roleId],
        });
    };

    return {
        getRoles,
        getRole,
        refetchRoles,
        refetchRole,
    };
};