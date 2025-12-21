import { useState, useEffect } from "react";

import { useConfig } from "@/lib/hooks/useConfig";
import { useApi } from "@/lib/hooks/useApi";
import { useAccount } from "@/lib/hooks/useAccount";
import { getToken, getRefreshToken, createSession, destroySession } from "@/lib/utils/auth";
import type { Profile } from "@/lib/types/account";
import { AuthContext, useAuth, type AuthContextType } from "./context";
import type { LoginResponse } from "./types";

export interface AuthenticatorProps {
    children: React.ReactNode;
}

export function Authenticator({ children }: AuthenticatorProps) {
    const [user, setUser] = useState<Profile | null>(null);
    const [roleAccess, setRoleAccess] = useState<string[] | null>(null);
    const [token, setToken] = useState<string>("");
    const [refreshToken, setRefreshToken] = useState<string>("");
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

    const { APIUrl } = useConfig();
    const api = useApi();
    const { getProfile } = useAccount();

    // handle user signin
    const signIn = async (email: string, password: string) => {
        try {
            const response = await api.POST<LoginResponse>(`${APIUrl}/auth/login`, {
                email,
                password,
            });

            if (response.status !== 200) {
                throw new Error(response.statusText);
            }

            // get data response
            const { data } = response;

            // set response to state
            createSession({
                accessToken: data.tokens.access_token,
                refreshToken: data.tokens.refresh_token,
            });

            setToken(data.tokens.access_token);

            // redirect to app dashboard
            window.location.href = `/app`;
        } catch (error) {
            console.error("Error while signed in:", error);
            throw error;
        }
    };

    // handle user signout
    const signOut = async () => {
        try {
            const response = await api.POST(`${APIUrl}/auth/logout`, {
                refresh_token: refreshToken,
            });

            if (response.status !== 200) {
                throw new Error(response.statusText);
            }

            // destroy session
            destroySession();
            setToken("");
        } catch (error) {
            console.error("Error while signing out: ", error);
            throw error;
        }
    };

    // handle user signout for all devices
    const signOutAll = async () => {
        try {
            const response = await api.POST(`${APIUrl}/auth/logout-all`, {});

            if (response.status !== 200) {
                throw new Error(response.statusText);
            }

            // destroy session
            destroySession();
            setToken("");
        } catch (error) {
            console.error("Error while signing out all: ", error);
            throw error;
        }
    };

    // authenticating
    useEffect(() => {
        setIsAuthLoading(true);

        // get access token
        const accessToken = getToken();

        if (accessToken) {
            setToken(accessToken);
        }

        // get refresh token
        const tokenRefresh = getRefreshToken();

        if (tokenRefresh) {
            setRefreshToken(tokenRefresh);
        }

        setIsAuthLoading(false);
    }, []);

    const isAuthenticated = token ? true : false;

    // get profile data
    const myProfile = getProfile({
        autoload: isAuthenticated,
        withRoleAccess: true,
    });

    useEffect(() => {
        if (myProfile.data) {
            setUser(myProfile.data.profile);

            if (myProfile.data.role_access) {
                setRoleAccess(myProfile.data.role_access);
            }
        }
    }, [myProfile.data]);

    // setup context props
    const value: AuthContextType = {
        user,
        roleAccess,
        token,
        isAuthLoading,
        isProfileLoading: myProfile.isLoading,
        setRefreshToken,
        updateUser: (val: Profile) => setUser(val),
        signIn,
        signOut,
        signOutAll,
    };

    if (isAuthLoading) {
        return null;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export { useAuth };