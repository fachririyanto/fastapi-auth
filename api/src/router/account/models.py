from pydantic import BaseModel


class UpdateProfileRequest(BaseModel):
    full_name: str = ""


class ChangePasswordRequest(BaseModel):
    old_password: str = ""
    new_password: str = ""
    confirm_password: str = ""


class RevokeTokenRequest(BaseModel):
    token_id: int = 0


class RevokeOtherSessionsRequest(BaseModel):
    refresh_token: str = ""
