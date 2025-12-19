export interface User {
    user_id: number;
    role_id: number;
    role_name: string;
    email: string;
    full_name: string;
    is_active: boolean;
    is_verified: boolean;
    verified_at: string;
    created_at: string;
    updated_at: string;
}