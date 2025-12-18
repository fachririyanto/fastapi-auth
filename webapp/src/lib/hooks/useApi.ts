import axios, {
    type AxiosRequestConfig,
    type AxiosResponse,
} from "axios";

import { getToken } from "@/lib/utils/auth";

/**
 * Create axios api object.
 * 
 * @var {axios}
 */
const api = axios.create({
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
});

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