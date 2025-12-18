import { Cookies } from "@/lib/utils/cookies";
import { useConfig } from "@/lib/hooks/useConfig";

export const authCookieName = {
    accessToken: "fastapi_access_token",
    refreshToken: "fastapi_refresh_token",
};

/**
 * Get access token from cookie.
 * 
 * @return {string} Access Token
 */
export const getToken = (): string => {
    return Cookies.get(authCookieName.accessToken) ?? "";
};

/**
 * Get refresh token from cookie.
 * 
 * @return {string} Refresh Token
 */
export const getRefreshToken = (): string => {
    return Cookies.get(authCookieName.refreshToken) ?? "";
};

/**
 * Save token to cookie.
 * 
 * @param {string} token Access token
 * @return {void}
 */
export const createSession = ({
    accessToken,
    refreshToken,
}: {
    accessToken: string;
    refreshToken: string;
}): void => {
    const { JWTTokenMinutes, JWTRefreshTokenDays } = useConfig();

    // set cookie for access token
    const accessTokenMinutes = new Date(
        new Date().getTime() + (1000 * parseInt(JWTTokenMinutes))
    );

    Cookies.set(authCookieName.accessToken, accessToken, {
        expires: accessTokenMinutes,
        sameSite: "strict",
    });

    // set cookie for refresh token
    const refreshTokenDays = new Date(
        new Date().getTime() + (1000 * 24 * parseInt(JWTRefreshTokenDays))
    );

    Cookies.set(authCookieName.refreshToken, refreshToken, {
        expires: refreshTokenDays,
        sameSite: "strict",
    });
};

/**
 * Remove token from cookie.
 * 
 * @return {void}
 */
export const destroySession = (): void => {
    Cookies.remove(authCookieName.accessToken);
    Cookies.remove(authCookieName.refreshToken);
};