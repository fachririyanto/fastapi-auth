import { createContext, useContext } from "react";

import type { Profile } from "@/lib/types/account";

export interface AuthContextType {
    user: Profile | null;
    roleAccess: string[] | null;
    token: string;
    isAuthLoading: boolean;
    isProfileLoading: boolean;

    // methods
    setRefreshToken: (refreshToken: string) => void;
    updateUser: (user: Profile) => void;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    signOutAll: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};