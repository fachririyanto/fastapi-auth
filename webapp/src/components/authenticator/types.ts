export interface LoginResponse {
    tokens: {
        access_token: string;
        refresh_token: string;
        token_type: string;
    };
}