export const superAdminID = () => {
    return 1;
};

export const isSuperAdmin = (userId: number): boolean => {
    return superAdminID() === userId;
};