# Capabilities
READ_SANDBOX = "read_sandbox"
CREATE_SANDBOX = "create_sandbox"
UPDATE_SANDBOX = "update_sandbox"
DELETE_SANDBOX = "delete_sandbox"

sandbox_capabilities = {
    "module_id": "sandbox",
    "module_name": "Sandbox",
    "capabilities": [
        { "id": READ_SANDBOX, "name": "Read Sandbox" },
        { "id": CREATE_SANDBOX, "name": "Create Sandbox" },
        { "id": UPDATE_SANDBOX, "name": "Update Sandbox" },
        { "id": DELETE_SANDBOX, "name": "Delete Sandbox" },
    ],
}
