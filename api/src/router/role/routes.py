from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from src.db import db_session
from src.dependencies.auth import authorize_token
from src.models.auth import AuthPayload
from src.services.role import get_all_role_capabilities

from .models import (
    CreateRoleRequest,
    UpdateRoleRequest,
    DeleteRoleRequest,
)


role_router = APIRouter(
    prefix="/role",
    tags=["Role"],
)

@role_router.get("/list")
def route_get_roles(
        request: Request,
        search: str = "",
        page: int = 1,
        limit: int = 10,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return {}

@role_router.get("/detail/{role_id}")
def route_get_role(
        request: Request,
        role_id: int,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return {}

@role_router.get("/capabilities")
def route_get_role_capabilities(
        request: Request,
        payload: AuthPayload = Depends(authorize_token),
    ):
    return {
        "data": get_all_role_capabilities(),
    }

@role_router.get("/capability/{role_id}")
def route_get_role_capability(
        request: Request,
        role_id: int,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return {}

@role_router.post("/create")
def route_create_role(
        request: Request,
        params: CreateRoleRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return {}

@role_router.patch("/update")
def route_update_role(
        request: Request,
        params: UpdateRoleRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return {}

@role_router.delete("/delete")
def route_delete_role(
        request: Request,
        params: DeleteRoleRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return {}
