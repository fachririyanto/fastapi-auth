from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session

from src.db import db_session
from src.dependencies.auth import authorize_token
from src.models.auth import AuthPayload

from modules.sandbox.handlers import (
    get_sandbox_list_handler,
    get_sandbox_detail_handler,
    create_sandbox_handler,
    update_sandbox_handler,
    delete_sandbox_handler,
)

from .models import (
    CreateSandboxRequest,
    UpdateSandboxRequest,
    DeleteSandboxRequest,
)


sandbox_router = APIRouter(
    prefix="/sandbox",
    tags=["Sandbox"],
)

@sandbox_router.get("/list")
def route_get_sandbox_list(
        request: Request,
        search: str = "",
        page: int = 1,
        limit: int = 10,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return get_sandbox_list_handler(
        request=request,
        search=search,
        page=page,
        limit=limit,
        payload=payload,
        session=session,
    )

@sandbox_router.get("/detail/{sandbox_id}")
def route_get_sandbox_detail(
        request: Request,
        sandbox_id: int,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return get_sandbox_detail_handler(
        request=request,
        sandbox_id=sandbox_id,
        payload=payload,
        session=session,
    )

@sandbox_router.post("/create")
def route_create_sandbox(
        request: Request,
        params: CreateSandboxRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return create_sandbox_handler(
        request=request,
        params=params,
        payload=payload,
        session=session,
    )

@sandbox_router.patch("/update")
def route_update_sandbox(
        request: Request,
        params: UpdateSandboxRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return update_sandbox_handler(
        request=request,
        params=params,
        payload=payload,
        session=session,
    )

@sandbox_router.delete("/delete")
def route_delete_sandbox(
        request: Request,
        params: DeleteSandboxRequest,
        payload: AuthPayload = Depends(authorize_token),
        session: Session = Depends(db_session),
    ):
    return delete_sandbox_handler(
        request=request,
        params=params,
        payload=payload,
        session=session,
    )
