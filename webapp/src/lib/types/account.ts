export interface Profile {
    user_id: number;
    email: string;
    full_name: string;
    role: number;
}

export interface UserToken {
    auth_id: number;
    created_at: string;
    ip_address: string;
    user_agent: string;
}