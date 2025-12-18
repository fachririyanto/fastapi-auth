import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Profile } from "@/lib/types/account";
import { useConfig, useConfigQuery } from "./useConfig";
import { useApi } from "./useApi";

export interface GetProfileResponse {
    profile: Profile;
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
    const getProfile = ({ autoload = true }: { autoload: boolean; }) => {
		return useQuery({
			queryKey: ["get_profile"],
			queryFn: async () => {
				const response = await api.GET<GetProfileResponse>(
					`${APIUrl}/account/me`
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
        updateProfile,
        changePassword,
        refetchProfile,
    };
};