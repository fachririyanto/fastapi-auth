import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Role } from "@/lib/types/role";
import type { Module } from "@/lib/types/capability";
import { useConfig, useConfigQuery } from "./useConfig";
import { useApi } from "./useApi";

export interface GetRolesResponse {
    roles: Role[];
    count: number;
}

export interface GetRoleResponse {
    role: Role[];
}

export interface GetRoleCapabilitiesResponse {
    capabilities: Module[];
}

export interface GetRoleCapabilityResponse {
    role_id: number;
    capabilities: string[];
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

    // get role capabilities
    const getRoleCapabilities = ({ autoload = true }: { autoload?: boolean; } = {}) => {
        return useQuery({
            queryKey: ["get_role_capabilities"],
            queryFn: async () => {
                const response = await api.GET<GetRoleCapabilitiesResponse>(
                    `${APIUrl}/role/capabilities`
                );

                return response.data;
            },
            enabled: autoload,
            retry,
            staleTime,
            refetchOnReconnect,
            refetchOnWindowFocus,
        });
    };

    // get role capability
    const getRoleCapability = (roleId: number) => {
        return useQuery({
            queryKey: ["get_role_capability", roleId],
            queryFn: async () => {
                const response = await api.GET<GetRoleCapabilityResponse>(
                    `${APIUrl}/role/capability/${roleId}`
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

    // create role
    const createRole = async ({
        roleName,
        capabilities,
    }: {
        roleName: string;
        capabilities: string[];
    }) => {
        const response = await api.POST(
            `${APIUrl}/role/create`,
            {
                data: {
                    role_name: roleName,
                    capabilities,
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // update role
    const updateRole = async ({
        roleId,
        roleName,
        capabilities,
    }: {
        roleId: number;
        roleName: string;
        capabilities: string[];
    }) => {
        const response = await api.PATCH(
            `${APIUrl}/role/update`,
            {
                data: {
                    role_id: roleId,
                    role_name: roleName,
                    capabilities,
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // delete role
    const deleteRole = async (roleId: number) => {
        const response = await api.DELETE(
            `${APIUrl}/role/delete`,
            {
                data: {
                    role_id: roleId,
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
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
        getRoleCapabilities,
        getRoleCapability,
        updateRole,
        createRole,
        deleteRole,
        refetchRoles,
        refetchRole,
    };
};