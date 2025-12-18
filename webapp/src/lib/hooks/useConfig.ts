export const useConfig = () => {
    return {
        // app config
        AppName: import.meta.env.VITE_APP_NAME,
        AppUrl: import.meta.env.VITE_APP_URL,
        AppVersion: import.meta.env.VITE_APP_VERSION,

        // api config
        APIUrl: import.meta.env.VITE_API_URL,

        // jwt config
        JWTTokenMinutes: import.meta.env.JWT_TOKEN_DURATION_MINUTES,
        JWTRefreshTokenDays: import.meta.env.JWT_REFRESH_TOKEN_DURATION_DAYS,
    };
};

/**
 * React query default config.
 */
export const useConfigQuery = () => {
    return {
        retry: false,
        staleTime: Infinity,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    };
};