from src.constants.capabilities import (
    # Role
    READ_ROLE,
    CREATE_ROLE,
    UPDATE_ROLE,
    DELETE_ROLE,

    # User
    READ_USER,
    CREATE_USER,
    UPDATE_USER,
    DELETE_USER,
)


app_role_capabilities = [
    {
        "module_id": "role",
        "module_name": "Role",
        "capabilities": [
            { "id": READ_ROLE, "name": "Read Role" },
            { "id": CREATE_ROLE, "name": "Create Role" },
            { "id": UPDATE_ROLE, "name": "Update Role" },
            { "id": DELETE_ROLE, "name": "Delete Role" },
        ],
    },
    {
        "module_id": "user",
        "module_name": "User",
        "capabilities": [
            { "id": READ_USER, "name": "Read User" },
            { "id": CREATE_USER, "name": "Create User" },
            { "id": UPDATE_USER, "name": "Update User" },
            { "id": DELETE_USER, "name": "Delete User" },
        ],
    },
]


def superadmin_role_id() -> int:
    """Get superadmin role_id"""
    return 1


def is_superadmin(role_id: int) -> bool:
    """Verify if role is superadmin role"""
    return superadmin_role_id() == role_id


def register_capabilities(capabilities):
    """Register new capabilities"""
    global app_role_capabilities
    app_role_capabilities = app_role_capabilities | capabilities


def get_all_role_capabilities():
    """Get all role capabilities"""
    global app_role_capabilities
    return app_role_capabilities
