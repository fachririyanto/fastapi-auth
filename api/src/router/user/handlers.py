from fastapi import Request, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, load_only
from sqlalchemy.sql import func

from lib.validator import is_valid_email
from lib.generator import generate_random_code
from lib.log_error import log_error
from src.config import app_config
from src.models.auth import AuthPayload
from src.services.auth import encrypt_password
from src.services.user import is_user_can
from src.services.mail import Mail
from src.repository import User, Role
from src.error import ForbiddenError, DataNotFoundError, ERROR_MESSAGES

from src.constants.capabilities import (
    READ_USER,
    CREATE_USER,
    UPDATE_USER,
    DELETE_USER,
)

from .models import (
    CreateUserRequest,
    ChangeUserStatusRequest,
    DeleteUserRequest,
)


def get_users_handler(
        request: Request,
        payload: AuthPayload,
        session: Session,
        search: str = "",
        page: int = 1,
        limit: int = 10,
    ):
    try:
        # Verify if user has permission to read roles
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[READ_USER],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Set offset for pagination
        offset = (page * limit) - limit

        # Setup base query & filters
        base_query = session.query(
            User.user_id,
            User.full_name,
            User.email,
            User.role,
            Role.role_name,
            User.is_active,
            User.is_verified,
            User.verified_at,
            User.created_at,
            User.updated_at,
        ).join(
            Role,
            Role.role_id == User.role,
        )

        filters = [
            User.is_deleted == False,
        ]

        # Apply search filter if provided
        if search:
            filters.append(
                User.full_name.ilike(f"%{search}%")
            )

        # Apply filters to the base query
        if limit == -1:
            results = base_query.filter(*filters).order_by(User.created_at.desc()).all()
        else:
            results = base_query.filter(*filters).order_by(User.created_at.desc()).offset(offset).limit(limit).all()

        users = [dict(
            user_id=user.user_id,
            role_id=user.role,
            role_name=user.role_name,
            full_name=user.full_name,
            email=user.email,
            is_active=user.is_active,
            is_verified=user.is_verified,
            verified_at=user.verified_at,
            created_at=user.created_at,
            updated_at=user.updated_at,
        ) for user in results]

        # Get total count for pagination
        total_count = base_query.filter(*filters).count()

        return {
            "users": users,
            "total": total_count,
        }
    except ForbiddenError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        log_error.add_error(
            message="An error occurred during get users",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during get users" if app_config.ENV == "production" else str(e),
        )


def get_user_handler(
        request: Request,
        payload: AuthPayload,
        session: Session,
        user_id: int,
    ):
    try:
        # Verify if user has permission to read user detail
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[READ_USER],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate user_id
        if not user_id:
            raise ValueError("User ID is required")

        # Get user details
        stmt = select(
            User,
        ).options(
            load_only(
                User.user_id,
                User.full_name,
                User.email,
                User.is_active,
                User.is_verified,
                User.created_at,
                User.updated_at,
            )
        ).where(
            User.user_id == user_id,
            User.is_deleted == False,
        )

        user = session.scalar(
            statement=stmt
        )

        if not user:
            raise DataNotFoundError("User not found")

        return {
            "user": user,
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
            message="An error occurred during get user detail",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during get user detail" if app_config.ENV == "production" else str(e),
        )


def create_user_handler(
        request: Request,
        params: CreateUserRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to create user
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[CREATE_USER],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate request params
        if not params.email:
            raise ValueError("Email is required")
        elif not is_valid_email(params.email):
            raise ValueError("Invalid email format")

        if not params.full_name:
            raise ValueError("Full name is required")

        if not params.role:
            raise ValueError("Role is required")

        # Check if email already exists
        existing_user = session.query(
            User.user_id,
        ).filter(
            User.email == params.email,
            User.is_deleted == False,
        ).first()

        if existing_user:
            raise ValueError("Email already exists")

        # Generate random password
        random_code = generate_random_code(length=6)
        random_password = encrypt_password(
            password=random_code + "_" + str(func.now()),
        )

        # Create new user
        new_user = User(
            email=params.email,
            password=random_password,
            full_name=params.full_name,
            role=params.role,
            verify_code=random_code,
            is_active=True,
            is_verified=False,
            created_by=int(payload.user_id),
            updated_at=func.now(),
        )

        session.add(new_user)

        # Commit transactions
        session.commit()

        # Send email
        try:
            mail = Mail(
                sender=app_config.MAIL_SENDER,
                to=params.email,
                subject="Account Verification",
                message=f"Click link below to verify your account and confirm a new password. Your activation code: {random_code}.\n<a href='{app_config.FRONTEND_APP_URL}/confirm-account?email={params.email}'>Confirm account</a>",
            )

            mail.send()
        except Exception as e:
            log_error.add_error(
                message="An error occurred during create user: send email",
                exc_info=e,
            )

        return {
            "data": {
                "user_id": new_user.user_id,
                "status": "user_created",
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
    except Exception as e:
        session.rollback()

        log_error.add_error(
            message="An error occurred during create user",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during create user" if app_config.ENV == "production" else str(e),
        )


def change_user_status_handler(
        request: Request,
        params: ChangeUserStatusRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to update user
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[UPDATE_USER],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate request params
        if not params.user_id:
            raise ValueError("User ID is required")

        if params.is_active is None:
            raise ValueError("Active status is required")

        # Check if user exists
        user = session.query(
            User,
        ).filter(
            User.user_id == params.user_id,
            User.is_deleted == False,
        ).first()

        if not user:
            raise DataNotFoundError("User not found")

        # Update user status
        user.is_active = params.is_active
        user.updated_at = func.now()

        # Commit transactions
        session.commit()

        return {
            "data": {
                "user_id": params.user_id,
                "status": "user_status_changed",
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
            message="An error occurred during change user status",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during change user status" if app_config.ENV == "production" else str(e),
        )


def delete_user_handler(
        request: Request,
        params: DeleteUserRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Verify if user has permission to delete user
        if not is_user_can(
                session=session,
                user_id=int(payload.user_id),
                capabilities=[DELETE_USER],
            ):
            raise ForbiddenError(ERROR_MESSAGES["forbidden"])

        # Validate request params
        if not params.user_id:
            raise ValueError("User ID is required")

        # Check if user exists
        user = session.query(
            User,
        ).filter(
            User.user_id == params.user_id,
            User.is_deleted == False,
        ).first()

        if not user:
            raise DataNotFoundError("User not found")

        # Soft delete user
        user.is_deleted = True
        user.updated_at = func.now()

        # Commit transactions
        session.commit()

        return {
            "data": {
                "user_id": params.user_id,
                "status": "user_deleted",
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
            message="An error occurred during delete user",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during delete user" if app_config.ENV == "production" else str(e),
        )
