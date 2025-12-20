from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from src.db import db_session
from src.dependencies.auth import authorize_token
from src.models.auth import AuthPayload

from .models import (
    CreateUserRequest,
    ChangeUserStatusRequest,
    ChangeUserRoleRequest,
    DeleteUserRequest,
)

from .handlers import (
    get_users_handler,
    get_user_handler,
    create_user_handler,
    change_user_status_handler,
    change_user_role_handler,
    delete_user_handler,
)


user_router = APIRouter(
    prefix="/user",
    tags=["User"],
)

@user_router.get("/list")
def route_get_users(
        request: Request,
        search: str = "",
        page: int = 1,
        limit: int = 10,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return get_users_handler(
        request=request,
        payload=payload,
        session=session,
        search=search,
        page=page,
        limit=limit,
    )

@user_router.get("/detail/{user_id}")
def route_get_user(
        request: Request,
        user_id: int,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return get_user_handler(
        request=request,
        user_id=user_id,
        payload=payload,
        session=session,
    )

@user_router.post("/create")
def route_create_user(
        request: Request,
        params: CreateUserRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return create_user_handler(
        request=request,
        params=params,
        payload=payload,
        session=session,
    )

@user_router.patch("/change-status")
def route_change_user_status(
        request: Request,
        params: ChangeUserStatusRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return change_user_status_handler(
        request=request,
        params=params,
        payload=payload,
        session=session,
    )

@user_router.patch("/change-role")
def route_change_user_role(
        request: Request,
        params: ChangeUserRoleRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return change_user_role_handler(
        request=request,
        params=params,
        payload=payload,
        session=session,
    )

@user_router.delete("/delete")
def route_delete_user(
        request: Request,
        params: DeleteUserRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return delete_user_handler(
        request=request,
        params=params,
        payload=payload,
        session=session,
    )
