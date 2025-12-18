import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown, defaultError: string = "An unknown error occurred"): string => {
    if (error instanceof AxiosError) {
        if (error.status === 500) {
            return error.message;
        }
        return error.response?.data?.detail || defaultError;
    } else if (error instanceof Error) {
        return error.message;
    } else {
        return defaultError;
    }
};