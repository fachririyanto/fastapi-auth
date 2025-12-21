from fastapi import Request, HTTPException, status, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, load_only
from sqlalchemy.sql import func

from lib.log_error import log_error
from src.config import app_config
from src.models.auth import AuthPayload
from src.services.user import is_user_can
from src.error import ForbiddenError, DataNotFoundError, ERROR_MESSAGES

from .capabilities import (
    READ_SANDBOX,
    CREATE_SANDBOX,
    UPDATE_SANDBOX,
    DELETE_SANDBOX,
)

from .models import (
    CreateSandboxRequest,
    UpdateSandboxRequest,
    DeleteSandboxRequest,
)

from .repository import Sandbox


def get_sandbox_list_handler(
        request: Request,
        search: str,
        page: int,
        limit: int,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to read sandbox
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[READ_SANDBOX],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Set offset for pagination
        offset = (page * limit) - limit

        # Setup base query & filters
        base_query = session.query(
            Sandbox.sandbox_id,
            Sandbox.sandbox_name,
            Sandbox.created_at,
            Sandbox.updated_at,
        )

        filters = []

        # Add search filter if provided
        if search:
            filters.append(Sandbox.sandbox_name.ilike(f"%{search}%"))

        # Apply filters to the base query
        if limit == -1:
            results = base_query.filter(*filters).all()
        else:
            results = base_query.filter(*filters).offset(offset).limit(limit).all()

        sandboxes = [dict(
            sandbox_id=sandbox.sandbox_id,
            sandbox_name=sandbox.sandbox_name,
            created_at=sandbox.created_at,
            updated_at=sandbox.updated_at,
        ) for sandbox in results]

        # Get total count for pagination
        total_count = base_query.filter(*filters).count()

        return {
            "sandboxes": sandboxes,
            "count": total_count,
        }
    except ForbiddenError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        log_error.add_error(
            message="An error occurred during get sandbox list",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during get sandbox list" if app_config.ENV == "production" else str(e),
        )


def get_sandbox_detail_handler(
        request: Request,
        sandbox_id: int,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to read sandbox
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[READ_SANDBOX],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate sandbox_id
        if not sandbox_id:
            raise ValueError("Sandbox ID is required")

        # Get sandbox details
        stmt = select(
            Sandbox,
        ).options(
            load_only(
                Sandbox.sandbox_id,
                Sandbox.sandbox_name,
                Sandbox.created_at,
                Sandbox.updated_at,
            )
        ).where(
            Sandbox.sandbox_id == sandbox_id,
        )

        sandbox = session.scalar(
            statement=stmt,
        )

        if not sandbox:
            raise DataNotFoundError("Sandbox not found")

        return {
            "sandbox": sandbox,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except ForbiddenError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except DataNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        log_error.add_error(
            message="An error occurred during get sandbox",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during get sandbox" if app_config.ENV == "production" else str(e),
        )


def create_sandbox_handler(
        request: Request,
        params: CreateSandboxRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to create sandbox
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[CREATE_SANDBOX],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate request params
        if not params.sandbox_name:
            raise ValueError("Sandbox name is required")

        # Create new sandbox
        new_sandbox = Sandbox(
            sandbox_name=params.sandbox_name,
            created_by=int(payload.user_id),
            updated_at=func.now(),
        )

        session.add(new_sandbox)
        session.flush()

        # Commit transactions
        session.commit()

        return {
            "data": {
                "sandbox_id": new_sandbox.sandbox_id,
                "status": "sandbox_created",
            },
        }
    except ForbiddenError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        session.rollback()

        log_error.add_error(
            message="An error occurred during create sandbox",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during create sandbox" if app_config.ENV == "production" else str(e),
        )


def update_sandbox_handler(
        request: Request,
        params: UpdateSandboxRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to update sandbox
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[UPDATE_SANDBOX],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate request params
        if not params.sandbox_id:
            raise ValueError("Sandbox ID is required")

        # Check if sandbox exists
        sandbox = session.query(
            Sandbox,
        ).filter(
            Sandbox.sandbox_id == params.sandbox_id,
        ).first()

        if not sandbox:
            raise DataNotFoundError("Sandbox not found")

        # Update sandbox data
        sandbox.sandbox_name = params.sandbox_name
        sandbox.updated_at = func.now()

        # Commit transactions
        session.commit()

        return {
            "data": {
                "sandbox_id": params.sandbox_id,
                "status": "sandbox_updated",
            },
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except ForbiddenError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except DataNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        session.rollback()

        log_error.add_error(
            message="An error occurred during update sandbox",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update sandbox" if app_config.ENV == "production" else str(e),
        )


def delete_sandbox_handler(
        request: Request,
        params: DeleteSandboxRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to delete sandbox
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[DELETE_SANDBOX],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate request params
        if not params.sandbox_id:
            raise ValueError("Sandbox ID is required")

        # Check if sandbox exists
        sandbox = session.query(
            Sandbox,
        ).filter(
            Sandbox.sandbox_id == params.sandbox_id,
        ).first()

        if not sandbox:
            raise DataNotFoundError("Sandbox not found")

        # Delete sandbox
        session.delete(sandbox)

        # Commit transactions
        session.commit()

        return {
            "data": {
                "sandbox_id": params.sandbox_id,
                "status": "sandbox_deleted",
            },
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except ForbiddenError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except DataNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        session.rollback()

        log_error.add_error(
            message="An error occurred during delete sandbox",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during delete sandbox" if app_config.ENV == "production" else str(e),
        )
