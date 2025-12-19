from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from src.db import db_session
from src.dependencies.auth import authorize_token
from src.models.auth import AuthPayload

from .models import (
    UpdateProfileRequest,
    ChangePasswordRequest,
)

from .handlers import (
    get_profile_me_handler,
    get_my_role_capabilities_handler,
    update_profile_handler,
    change_password_handler,
)


account_router = APIRouter(
    prefix="/account",
    tags=["Account"],
)

@account_router.get("/me")
def route_get_profile(
        request: Request,
        with_role_access: bool = False,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return get_profile_me_handler(
        request=request,
        with_role_access=with_role_access,
        payload=payload,
        session=session,
    )

@account_router.get("/role-access")
def route_get_my_role_capabilities(
        request: Request,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return get_my_role_capabilities_handler(request=request, payload=payload, session=session)

@account_router.post("/update-profile")
def route_update_profile(
        request: Request,
        params: UpdateProfileRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return update_profile_handler(request=request, params=params, payload=payload, session=session)

@account_router.post("/change-password")
def route_change_password(
        request: Request,
        params: ChangePasswordRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return change_password_handler(request=request, params=params, payload=payload, session=session)
