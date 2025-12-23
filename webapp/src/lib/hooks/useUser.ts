import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { User } from "@/lib/types/user";
import { APIUrl, TanstackQuery } from "@/lib/config";
import { useApi } from "./useApi";

export interface GetUsersResponse {
    users: User[];
    count: number;
}

export interface GetUserResponse {
    user: User[];
}

export const useUser = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    const {
        retry,
        staleTime,
        refetchOnReconnect,
        refetchOnWindowFocus,
    } = TanstackQuery;

    // get list of users
    const getUsers = ({
        search = "",
        page = 1,
        limit = 10,
    }: {
        search?: string;
        page?: number;
        limit?: number;
    } = {}) => {
        return useQuery({
            queryKey: ["get_users", search, page, limit],
            queryFn: async () => {
                const response = await api.GET<GetUsersResponse>(
                    `${APIUrl}/user/list?search=${search}&page=${page}&limit=${limit}`
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

    // get user detail
    const getUser = (userId: number) => {
        return useQuery({
            queryKey: ["get_user", userId],
            queryFn: async () => {
                const response = await api.GET<GetUserResponse>(
                    `${APIUrl}/user/detail/${userId}`
                );

                return response.data;
            },
            enabled: userId > 0,
            retry,
            staleTime,
            refetchOnReconnect,
            refetchOnWindowFocus,
        });
    };

    // create user
    const createUser = async ({
        email,
        fullName,
        role,
    }: {
        email: string;
        fullName: string;
        role: number;
    }) => {
        const response = await api.POST(
            `${APIUrl}/user/create`,
            {
                email,
                full_name: fullName,
                role,
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // change status
    const changeStatus = async ({
        userId,
        isActive,
    }: {
        userId: number;
        isActive: boolean;
    }) => {
        const response = await api.PATCH(
            `${APIUrl}/user/change-status`,
            {
                user_id: userId,
                is_active: isActive,
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // change role
    const changeRole = async ({
        userId,
        roleId,
    }: {
        userId: number;
        roleId: number;
    }) => {
        const response = await api.PATCH(
            `${APIUrl}/user/change-role`,
            {
                user_id: userId,
                role: roleId,
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // delete user
    const deleteUser = async (userId: number) => {
        const response = await api.DELETE(
            `${APIUrl}/user/delete`,
            {
                data: {
                    user_id: userId,
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // refetch list of users
    const refetchUsers = () => {
        queryClient.invalidateQueries({
            queryKey: ["get_users"],
        });
    };

    // refetch detail user
    const refetchUser = (userId: number) => {
        queryClient.invalidateQueries({
            queryKey: ["get_user", userId],
        });
    };

    return {
        getUsers,
        getUser,
        createUser,
        changeStatus,
        changeRole,
        deleteUser,
        refetchUsers,
        refetchUser,
    };
};