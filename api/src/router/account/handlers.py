from fastapi import Request, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, load_only
from sqlalchemy.sql import func

from lib.log_error import log_error
from src.config import app_config
from src.models.auth import AuthPayload
from src.repository import User, RoleCapabilities, AuthToken
from src.services.auth import verify_password, encrypt_password
from src.error import DataNotFoundError

from .models import (
    UpdateProfileRequest,
    ChangePasswordRequest,
    RevokeTokenRequest,
    RevokeOtherSessionsRequest,
)


def get_profile_me_handler(
        request: Request,
        with_role_access: bool,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        stmt = select(
            User,
        ).options(
            load_only(
                User.email,
                User.full_name,
                User.role,
            )
        ).where(
            User.user_id == int(payload.user_id),
            User.is_deleted == False,
        )

        profile = session.scalar(
            statement=stmt,
        )

        if not profile:
            raise DataNotFoundError("Profile is not found")

        # Get role access if True
        if with_role_access:
            role_access = session.scalars(
                select(
                    RoleCapabilities.capability_id,
                ).filter(
                    RoleCapabilities.role_id == profile.role,
                )
            ).all()

            return {
                "profile": profile,
                "role_access": role_access,
            }

        return {
            "profile": profile,
        }
    except DataNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        log_error.add_error(
            message="An error occurred during get profile",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during get profile" if app_config.ENV == "production" else str(e),
        )


def get_my_role_capabilities_handler(
        request: Request,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        capabilities = session.scalars(
            select(
                RoleCapabilities.capability_id,
            ).join(
                User,
                User.role == RoleCapabilities.role_id,
            ).filter(
                User.user_id == int(payload.user_id),
                User.is_deleted.is_(False),
            )
        ).all()

        return {
            "capabilities": capabilities,
        }
    except Exception as e:
        log_error.add_error(
            message="An error occurred during get my role capabilities",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during get my role capabilities" if app_config.ENV == "production" else str(e),
        )


def update_profile_handler(
        request: Request,
        params: UpdateProfileRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Validate request params
        if not params.full_name:
            raise ValueError("Full name is required")

        # Check if profile is exists
        profile = session.query(
            User,
        ).filter(
            User.user_id == int(payload.user_id),
            User.is_deleted == False,
        ).first()

        if not profile:
            raise DataNotFoundError("Profile not found")

        # Update profile data
        profile.full_name = params.full_name
        profile.updated_at = func.now()

        # Commit transactions
        session.commit()

        return {
            "data": {
                "status": "profile_updated",
            },
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
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
            message="An error occurred during update profile",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during update profile" if app_config.ENV == "production" else str(e),
        )


def change_password_handler(
        request: Request,
        params: ChangePasswordRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Validate request params
        if not params.old_password:
            raise ValueError("Old password is required")

        if not params.new_password:
            raise ValueError("New password is required")

        if not params.confirm_password:
            raise ValueError("Confirm password is required")
        elif params.confirm_password != params.new_password:
            raise ValueError("Invalid confirm password")

        # Check if profile is exists
        profile = session.query(
            User,
        ).filter(
            User.user_id == int(payload.user_id),
            User.is_deleted == False,
        ).first()

        if not profile:
            raise DataNotFoundError("Profile not found")

        # Verify old password
        if not verify_password(password=params.old_password, hashed_password=profile.password):
            raise ValueError("Invalid old password")

        # Update user password
        profile.password = encrypt_password(password=params.new_password)
        profile.updated_at = func.now()

        # Commit transactions
        session.commit()

        return {
            "data": {
                "status": "password_changed",
            },
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
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
            message="An error occurred during change password",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during change password" if app_config.ENV == "production" else str(e),
        )


def get_user_tokens_handler(
        request: Request,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Get user tokens
        results = session.query(
            AuthToken.auth_id,
            AuthToken.created_at,
            AuthToken.ip_address,
            AuthToken.user_agent,
        ).filter(
            AuthToken.user_id == int(payload.user_id),
        ).all()

        tokens = [dict(
            auth_id=token.auth_id,
            created_at=token.created_at,
            ip_address=token.ip_address,
            user_agent=token.user_agent,
        ) for token in results]

        return {
            "tokens": tokens,
        }
    except Exception as e:
        log_error.add_error(
            message="An error occurred during get user tokens",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during get user tokens" if app_config.ENV == "production" else str(e),
        )


def revoke_token_handler(
        request: Request,
        params: RevokeTokenRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Validate request params
        if not params.token_id:
            raise ValueError("Token ID is required")

        # Check if token is exists
        token = session.query(
            AuthToken,
        ).filter(
            AuthToken.auth_id == params.token_id,
            AuthToken.user_id == int(payload.user_id),
        ).first()

        if not token:
            raise DataNotFoundError("Token not found")

        # Delete token
        session.delete(token)

        # Commit transactions
        session.commit()

        return {
            "data": {
                "status": "token_deleted",
            },
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
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
            message="An error occurred during revoke token",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during revoke token" if app_config.ENV == "production" else str(e),
        )


def revoke_other_sessions_handler(
        request: Request,
        params: RevokeOtherSessionsRequest,
        payload: AuthPayload,
        session: Session,
    ):
    try:
        # Validate request params
        if not params.refresh_token:
            raise ValueError("Refresh token is required")

        # Check if token is exists
        tokens = session.query(
            AuthToken,
        ).filter(
            AuthToken.user_id == int(payload.user_id),
        ).all()

        if not tokens:
            raise DataNotFoundError("Token not found")

        # Delete all tokens except current session
        for token in tokens:
            if token.refresh_token != params.refresh_token:
                session.delete(token)

        # Commit transactions
        session.commit()

        return {
            "data": {
                "status": "other_tokens_deleted",
            },
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
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
            message="An error occurred during revoke token",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during revoke token" if app_config.ENV == "production" else str(e),
        )
