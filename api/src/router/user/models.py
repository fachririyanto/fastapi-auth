from pydantic import BaseModel


class CreateUserRequest(BaseModel):
    email: str = ""
    full_name: str = ""
    role: int = 0


class ChangeUserStatusRequest(BaseModel):
    user_id: int = 0
    is_active: bool = True


class DeleteUserRequest(BaseModel):
    user_id: int = 0
