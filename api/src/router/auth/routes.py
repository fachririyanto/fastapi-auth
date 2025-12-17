from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from src.db import db_session
from src.models.auth import AuthPayload
from src.dependencies.auth import authorize_token

from .models import (
    LoginRequest,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ConfirmAccountRequest,
    LogoutRequest,
)

from .handlers import (
    login_handler,
    refresh_token_handler,
    forgot_password_handler,
    reset_password_handler,
    confirm_account_handler,
    logout_handler,
    logout_all_handler,
)


auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@auth_router.post("/login")
def route_login(
        request: Request,
        params: LoginRequest,
        session: Session = Depends(db_session),
    ):
    return login_handler(request=request, params=params, session=session)

@auth_router.post("/refresh-token")
def route_refresh_token(
        request: Request,
        params: RefreshTokenRequest,
        session: Session = Depends(db_session),
    ):
    return refresh_token_handler(request=request, params=params, session=session)

@auth_router.post("/forgot-password")
def route_forgot_password(
        request: Request,
        params: ForgotPasswordRequest,
        session: Session = Depends(db_session),
    ):
    return forgot_password_handler(request=request, params=params, session=session)

@auth_router.post("/reset-password")
def route_reset_password(
        request: Request,
        params: ResetPasswordRequest,
        session: Session = Depends(db_session),
    ):
    return reset_password_handler(request=request, params=params, session=session)

@auth_router.post("/confirm-account")
def route_confirm_account(
        request: Request,
        params: ConfirmAccountRequest,
        session: Session = Depends(db_session),
    ):
    return confirm_account_handler(request=request, params=params, session=session)

@auth_router.post("/logout")
def route_logout(
        request: Request,
        params: LogoutRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return logout_handler(request=request, params=params, payload=payload, session=session)

@auth_router.post("/logout-all")
def route_logout_all(
        request: Request,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return logout_all_handler(request=request, payload=payload, session=session)
