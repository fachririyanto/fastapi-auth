// app config
export const AppName = import.meta.env.VITE_APP_NAME;
export const AppUrl = import.meta.env.VITE_APP_URL;
export const AppVersion = import.meta.env.VITE_APP_VERSION;

// api config
export const APIUrl = import.meta.env.VITE_API_URL;

// jwt config
export const JWTTokenMinutes = import.meta.env.JWT_TOKEN_DURATION_MINUTES;
export const JWTRefreshTokenDays = import.meta.env.JWT_REFRESH_TOKEN_DURATION_DAYS;

// tanstack query config
export const TanstackQuery = {
    retry: false,
    staleTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
};