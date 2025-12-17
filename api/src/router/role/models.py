from pydantic import BaseModel


class CreateRoleRequest(BaseModel):
    role_name: str = ""
    capabilities: list[str] = []


class UpdateRoleRequest(BaseModel):
    role_id: int = 0
    role_name: str = ""
    capabilities: list[str] = []


class DeleteRoleRequest(BaseModel):
    role_id: int = 0
