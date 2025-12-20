from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from src.db import db_session
from src.dependencies.auth import authorize_token
from src.models.auth import AuthPayload

from .models import (
    CreateRoleRequest,
    UpdateRoleRequest,
    DeleteRoleRequest,
)

from .handlers import (
    get_roles_handler,
    get_role_handler,
    get_all_role_capabilities_handler,
    get_role_capability_handler,
    create_role_handler,
    update_role_handler,
    delete_role_handler,
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
    return get_roles_handler(
        request=request,
        payload=payload,
        session=session,
        search=search,
        page=page,
        limit=limit,
    )

@role_router.get("/detail/{role_id}")
def route_get_role(
        request: Request,
        role_id: int,
        with_role_access: bool = False,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return get_role_handler(
        request=request,
        role_id=role_id,
        with_role_access=with_role_access,
        payload=payload,
        session=session,
    )

@role_router.get("/capabilities")
def route_get_role_capabilities(
        request: Request,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return get_all_role_capabilities_handler(
        request=request,
        payload=payload,
        session=session,
    )

@role_router.get("/capability/{role_id}")
def route_get_role_capability(
        request: Request,
        role_id: int,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return get_role_capability_handler(
        request=request,
        role_id=role_id,
        payload=payload,
        session=session,
    )

@role_router.post("/create")
def route_create_role(
        request: Request,
        params: CreateRoleRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return create_role_handler(
        request=request,
        params=params,
        payload=payload,
        session=session,
    )

@role_router.patch("/update")
def route_update_role(
        request: Request,
        params: UpdateRoleRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return update_role_handler(
        request=request,
        params=params,
        payload=payload,
        session=session,
    )

@role_router.delete("/delete")
def route_delete_role(
        request: Request,
        params: DeleteRoleRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return delete_role_handler(
        request=request,
        params=params,
        payload=payload,
        session=session,
    )
