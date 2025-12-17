from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from src.db import db_session
from src.dependencies.auth import authorize_token
from src.models.auth import AuthPayload

from .models import (
    CreateUserRequest,
    ChangeUserStatusRequest,
    DeleteUserRequest,
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
    return {}

@user_router.get("/detail/{user_id}")
def route_get_user(
        request: Request,
        user_id: int,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return {}

@user_router.post("/create")
def route_create_user(
        request: Request,
        params: CreateUserRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return {}

@user_router.patch("/change-status")
def route_change_user_status(
        request: Request,
        params: ChangeUserStatusRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return {}

@user_router.delete("/delete")
def route_delete_user(
        request: Request,
        params: DeleteUserRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return {}
