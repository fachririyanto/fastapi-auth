import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Profile } from "@/lib/types/account";
import { useConfig, useConfigQuery } from "./useConfig";
import { useApi } from "./useApi";

export interface GetProfileResponse {
    profile: Profile;
    role_access?: string[];
}

export const useAccount = () => {
    const api = useApi();
    const { APIUrl } = useConfig();
	const queryClient = useQueryClient();

    const {
        retry,
        staleTime,
        refetchOnReconnect,
        refetchOnWindowFocus,
    } = useConfigQuery();

    // get current user profile
    const getProfile = ({
        autoload = true,
        withRoleAccess = false,
    }: {
        autoload?: boolean;
        withRoleAccess?: boolean;
    }) => {
		return useQuery({
			queryKey: ["get_profile"],
			queryFn: async () => {
				const response = await api.GET<GetProfileResponse>(
					`${APIUrl}/account/me?with_role_access=${withRoleAccess}`
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

    // forgot password
    const forgotPassword = async ({
        email,
    }: {
        email: string;
    }) => {
        const response = await api.POST(
            `${APIUrl}/auth/forgot-password`,
            {
                email,
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // reset password
    const resetPassword = async ({
        email,
        resetCode,
        password,
        confirmPassword,
    }: {
        email: string;
        resetCode: string;
        password: string;
        confirmPassword: string;
    }) => {
        const response = await api.POST(
            `${APIUrl}/auth/reset-password`,
            {
                email,
                code: resetCode,
                new_password: password,
                confirm_password: confirmPassword,
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // confirm account
    const confirmAccount = async ({
        email,
        verifyCode,
        password,
        confirmPassword,
    }: {
        email: string;
        verifyCode: string;
        password: string;
        confirmPassword: string;
    }) => {
        const response = await api.POST(
            `${APIUrl}/auth/confirm-account`,
            {
                email,
                code: verifyCode,
                new_password: password,
                confirm_password: confirmPassword,
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // update profile
    const updateProfile = async ({
        fullName,
    }: {
        fullName: string;
    }) => {
        const response = await api.POST(
            `${APIUrl}/account/update-profile`,
            {
                full_name: fullName,
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // change password
    const changePassword = async ({
        oldPassword,
        newPassword,
        confirmPassword,
    }: {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        const response = await api.POST(
            `${APIUrl}/account/change-password`,
            {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            }
        );

        if (response.status !== 200) {
            throw new Error(response.statusText);
        }

        return response.data;
    };

    // refetch data profile
    const refetchProfile = () => {
        queryClient.invalidateQueries({
            queryKey: ["get_profile"],
        });
    };

    return {
        getProfile,
        forgotPassword,
        resetPassword,
        confirmAccount,
        updateProfile,
        changePassword,
        refetchProfile,
    };
};