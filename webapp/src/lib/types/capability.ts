export const Capability = {
    // role
    readRole: "read_role",
    createRole: "create_role",
    updateRole: "update_role",
    deleteRole: "delete_role",

    // user
    readUser: "read_user",
    createUser: "create_user",
    updateUser: "update_user",
    deleteUser: "delete_user",

    // sandbox
    readSandbox: "read_sandbox",
    createSandbox: "create_sandbox",
    updateSandbox: "update_sandbox",
    deleteSandbox: "delete_sandbox",
} as const;

export interface Module {
    module_id: string;
    module_name: string;
    capabilities: Capability[];
}

export interface Capability {
    id: string;
    name: string;
}