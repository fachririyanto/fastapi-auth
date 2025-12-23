import axios, {
    type AxiosRequestConfig,
    type AxiosResponse,
} from "axios";

import {
    getToken,
    getRefreshToken,
    createSession,
    destroySession,
} from "@/lib/utils/auth";

import { APIUrl } from "@/lib/config";

/**
 * Create axios api object.
 * 
 * @var {axios}
 */
const api = axios.create({
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
});

const refreshApi = axios.create({
    baseURL: APIUrl,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
});

/**
 * Request refresh token.
 */
const requestRefreshToken = async () => {
    const response = await refreshApi.post(`/auth/refresh-token`, {
        refresh_token: getRefreshToken(),
    });

    if (response.status !== 200) {
        throw new Error("Failed to refresh token");
    }

    return response.data;
};

/**
 * Add refresh token queue.
 */
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        error ? prom.reject(error) : prom.resolve(token);
    });
    failedQueue = [];
};

/**
 * Handle api request.
 */
api.interceptors.request.use(async (config) => {
    const token = getToken();

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * Handle api response.
 */
api.interceptors.response.use(async (response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    // handle 401 errors (Unauthorized)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    },
                    reject,
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getRefreshToken();

        if (refreshToken) {
            try {
                const data = await requestRefreshToken();

                // create new session
                createSession({
                    accessToken: data.tokens.access_token,
                    refreshToken: data.tokens.refresh_token,
                });

                // update token
                originalRequest.headers["Authorization"] = `Bearer ${data.tokens.access_token}`;

                // update refresh token if logout action
                if (
                    originalRequest.url.includes("/auth/logout")
                    || originalRequest.url.includes("/account/revoke-other-sessions")
                ) {
                    originalRequest.data = JSON.stringify({
                        refresh_token: data.tokens.refresh_token,
                    });
                }

                processQueue(null, data.tokens.access_token);

                return api(originalRequest);
            } catch (err) {
                destroySession();

                // redirect to login page
                window.location.href = "/";

                return Promise.reject(err);
            }
        } else {
            // no refresh token, destroy session
            destroySession();

            // redirect to login page
            window.location.href = "/";

            return Promise.reject(error);
        }
    }

    return Promise.reject(error);
});

/**
 * useAPI hooks.
 * 
 * @return {Object}
 */
export const useApi = () => {
    const GET = async <T,>(path: string, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return await api.get(path, options);
    };

    const POST = async <T,>(path: string, data: any, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return await api.post(path, data, options);
    };

    const PUT = async <T,>(path: string, data: any, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return await api.put(path, data, options);
    };

    const PATCH = async <T,>(path: string, data: any, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return await api.patch(path, data, options);
    };

    const DELETE = async <T,>(path: string, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return await api.delete(path, options);
    };

    return { GET, POST, PUT, PATCH, DELETE };
};

export type {
    AxiosRequestConfig,
    AxiosResponse,
};