export const superAdminRoleID = () => {
    return 1;
};

export const isSuperAdminRole = (roleId: number): boolean => {
    return superAdminRoleID() === roleId;
};