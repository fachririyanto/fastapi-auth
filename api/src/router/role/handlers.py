from fastapi import Request, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, load_only
from sqlalchemy.sql import func

from lib.log_error import log_error
from src.config import app_config
from src.models.auth import AuthPayload
from src.services.user import is_user_can
from src.services.role import superadmin_role_id, get_all_role_capabilities
from src.repository import User, Role, RoleCapabilities
from src.error import ForbiddenError, DataNotFoundError, ERROR_MESSAGES

from src.constants.capabilities import (
    READ_ROLE,
    CREATE_ROLE,
    UPDATE_ROLE,
    DELETE_ROLE,
    CREATE_USER,
    UPDATE_USER,
)

from .models import (
    CreateRoleRequest,
    UpdateRoleRequest,
    DeleteRoleRequest,
)


def get_roles_handler(
        request: Request,
        payload: AuthPayload,
        session: Session,
        search: str,
        page: int,
        limit: int,
    ):
    try:
        # Verify if user has permission to read roles
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[READ_ROLE, CREATE_USER, UPDATE_USER],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Set offset for pagination
        offset = (page * limit) - limit

        # Setup base query & filters
        base_query = session.query(
            Role.role_id,
            Role.role_name,
            Role.created_at,
            Role.updated_at,
        )

        filters = [
            Role.role_id != superadmin_role_id(),
        ]

        # Add search filter if provided
        if search:
            filters.append(Role.role_name.ilike(f"%{search}%"))

        # Apply filters to the base query
        if limit == -1:
            results = base_query.filter(*filters).all()
        else:
            results = base_query.filter(*filters).offset(offset).limit(limit).all()

        roles = [dict(
            role_id=role.role_id,
            role_name=role.role_name,
            created_at=role.created_at,
            updated_at=role.updated_at,
        ) for role in results]

        # Get total count for pagination
        total_count = base_query.filter(*filters).count()

        return {
            "roles": roles,
            "count": total_count,
        }
    except ForbiddenError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        log_error.add_error(
            message="An error occurred during get roles",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during get roles" if app_config.ENV == "production" else str(e),
        )


def get_role_handler(
        request: Request,
        role_id: int,
        with_role_access: bool,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to read roles
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[READ_ROLE],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate role_id
        if not role_id:
            raise ValueError("Role ID is required")

        # Get role details
        stmt = select(
            Role,
        ).options(
            load_only(
                Role.role_id,
                Role.role_name,
                Role.created_at,
                Role.updated_at,
            )
        ).where(
            Role.role_id == role_id,
        )

        role = session.scalar(
            statement=stmt,
        )

        if not role:
            raise DataNotFoundError("Role not found")

        # Get role access if True
        if with_role_access:
            role_access = session.scalars(
                select(
                    RoleCapabilities.capability_id,
                ).filter(
                    RoleCapabilities.role_id == role.role_id,
                )
            ).all()

            return {
                "role": role,
                "capabilities": role_access,
            }

        return {
            "role": role,
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
            message="An error occurred during get role",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during get role" if app_config.ENV == "production" else str(e),
        )


def get_all_role_capabilities_handler(
        request: Request,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to read roles
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[READ_ROLE],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        return {
            "modules": get_all_role_capabilities(),
        }
    except Exception as e:
        log_error.add_error(
            message="An error occurred during get all role capabilities",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during get all role capabilities" if app_config.ENV == "production" else str(e),
        )


def get_role_capability_handler(
        request: Request,
        role_id: int,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to read roles
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[READ_ROLE],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate role_id
        if not role_id:
            raise ValueError("Role ID is required")

        # Get role details
        stmt = select(
            Role,
        ).where(
            Role.role_id == role_id,
        )

        role = session.scalar(
            statement=stmt,
        )

        if not role:
            raise DataNotFoundError("Role not found")

        # Get role capabilities
        capabilities = session.scalars(
            select(
                RoleCapabilities.capability_id,
            ).filter(
                RoleCapabilities.role_id == role_id,
            )
        ).all()

        return {
            "role_id": role_id,
            "capabilities": capabilities,
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
            message="An error occurred during get role capability",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during get role capability" if app_config.ENV == "production" else str(e),
        )


def create_role_handler(
        request: Request,
        params: CreateRoleRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to create roles
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[CREATE_ROLE],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate request params
        if not params.role_name:
            raise ValueError("Role name is required")

        # Create new role
        new_role = Role(
            role_name=params.role_name,
            created_by=int(payload.user_id),
            updated_at=func.now(),
        )

        session.add(new_role)
        session.flush()

        # Assign capabilities to the new role
        if len(params.capabilities) > 0:
            new_capabilities = []

            for capability_id in params.capabilities:
                new_capabilities.append(RoleCapabilities(
                    role_id=new_role.role_id,
                    capability_id=capability_id,
                ))

            session.add_all(new_capabilities)

        # Commit transactions
        session.commit()

        return {
            "data": {
                "role_id": new_role.role_id,
                "status": "role_created",
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
            message="An error occurred during create role",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during create role" if app_config.ENV == "production" else str(e),
        )


def update_role_handler(
        request: Request,
        params: UpdateRoleRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to update roles
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[UPDATE_ROLE],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate request params
        if not params.role_id:
            raise ValueError("Role ID is required")

        # Check if role exists
        role = session.query(
            Role,
        ).filter(
            Role.role_id == params.role_id,
        ).first()

        if not role:
            raise DataNotFoundError("Role not found")

        # Update role data
        role.role_name = params.role_name
        role.updated_at = func.now()

        # Update role capabilities
        if params.capabilities is not None:
            # Delete existing capabilities
            session.query(
                RoleCapabilities,
            ).filter(
                RoleCapabilities.role_id == params.role_id,
            ).delete()

            # Add new capabilities
            new_capabilities = []

            for capability_id in params.capabilities:
                new_capabilities.append(RoleCapabilities(
                    role_id=params.role_id,
                    capability_id=capability_id,
                ))

            session.add_all(new_capabilities)

        # Commit transactions
        session.commit()

        return {
            "data": {
                "role_id": params.role_id,
                "status": "role_updated",
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
            message="An error occurred during update role",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update role" if app_config.ENV == "production" else str(e),
        )


def delete_role_handler(
        request: Request,
        params: DeleteRoleRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to delete roles
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[DELETE_ROLE],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate request params
        if not params.role_id:
            raise ValueError("Role ID is required")

        # Check if role exists
        role = session.query(
            Role,
        ).filter(
            Role.role_id == params.role_id,
        ).first()

        if not role:
            raise DataNotFoundError("Role not found")

        # Check if role is assigned to any user
        assigned_user_count = session.query(
            func.count(),
        ).select_from(
            User,
        ).filter(
            User.role == params.role_id,
            User.is_deleted.is_(False),
        ).scalar()

        if assigned_user_count > 0:
            raise ForbiddenError("Role is assigned to existing users and cannot be deleted")

        # Delete role capabilities
        session.query(
            RoleCapabilities,
        ).filter(
            RoleCapabilities.role_id == params.role_id,
        ).delete()

        # Delete role
        session.delete(role)

        # Commit transactions
        session.commit()

        return {
            "data": {
                "role_id": params.role_id,
                "status": "role_deleted",
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
            message="An error occurred during delete role",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during delete role" if app_config.ENV == "production" else str(e),
        )
