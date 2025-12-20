from pydantic import BaseModel


class CreateUserRequest(BaseModel):
    email: str = ""
    full_name: str = ""
    role: int = 0


class ChangeUserStatusRequest(BaseModel):
    user_id: int = 0
    is_active: bool = True


class ChangeUserRoleRequest(BaseModel):
    user_id: int = 0
    role: int = 0


class DeleteUserRequest(BaseModel):
    user_id: int = 0
