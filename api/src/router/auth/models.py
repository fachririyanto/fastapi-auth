from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str = ""
    password: str = ""


class RefreshTokenRequest(BaseModel):
    refresh_token: str = ""


class ForgotPasswordRequest(BaseModel):
    email: str = ""


class ResetPasswordRequest(BaseModel):
    email: str = ""
    code: str = ""
    new_password: str = ""
    confirm_password: str = ""


class LogoutRequest(BaseModel):
    refresh_token: str = ""
