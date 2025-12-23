import datetime

from fastapi import Request, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, load_only
from sqlalchemy.sql import func

from lib.log_error import log_error
from lib.validator import is_valid_email
from lib.generator import generate_random_code
from src.config import app_config
from src.models.auth import AuthPayload
from src.repository import User, AuthToken
from src.services.auth import verify_password, generate_token, encrypt_password
from src.services.mail import Mail
from src.error import UnauthorizedError, ForbiddenError, DataNotFoundError

from .models import (
    LoginRequest,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ConfirmAccountRequest,
    LogoutRequest,
)


def login_handler(request: Request, params: LoginRequest, session: Session):
    try:
        # Validate request params
        if not params.email:
            raise ValueError("Email is required")
        elif not is_valid_email(params.email):
            raise ValueError("Invalid email format")

        if not params.password:
            raise ValueError("Password is required")

        # Check if email is exists
        stmt = select(User).options(
            load_only(
                User.user_id,
                User.password,
                User.is_verified,
                User.is_active,
            )
        ).where(
            User.email == params.email,
            User.is_deleted == False,
        )

        user = session.scalar(statement=stmt)

        if not user:
            raise DataNotFoundError("User not found")

        # Check if user is verified
        if not user.is_verified:
            raise ValueError("User is not verified")

        # Check if user is active
        if not user.is_active:
            raise ValueError("User is not active")

        # Verify password
        if not verify_password(password=params.password, hashed_password=user.password):
            raise ValueError("Incorrect password")

        # Generate token
        tokens = generate_token(user_id=str(user.user_id))

        # Create refresh token expiration date
        days_added_from_now = datetime.timedelta(
            days=int(app_config.JWT_REFRESH_TOKEN_DURATION_DAYS),
        )

        refresh_token_expiration_date = func.now() + days_added_from_now

        # Save refresh token to auth tokens log
        session.add(
            AuthToken(
                user_id=user.user_id,
                refresh_token=tokens["refresh_token"],
                user_agent=request.headers.get("user-agent"),
                ip_address=request.client.host,
                expires_at=refresh_token_expiration_date,
            )
        )

        # Commit transactions
        session.commit()

        return {
            "tokens": tokens,
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
            message="An error occurred during login",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login" if app_config.ENV == "production" else str(e),
        )


def refresh_token_handler(request: Request, params: RefreshTokenRequest, session: Session):
    try:
        # Validate request params
        if not params.refresh_token:
            raise ValueError("Refresh token is required")

        # Verify refresh token
        refresh_token = session.query(
            AuthToken,
        ).filter(
            AuthToken.refresh_token == params.refresh_token,
        ).first()

        if not refresh_token:
            raise ForbiddenError("Invalid refresh token")

        if refresh_token.expires_at <= datetime.datetime.now(datetime.timezone.utc):
            # Delete the expired refresh token
            session.delete(refresh_token)
            session.commit()
            raise ForbiddenError("Refresh token is expired")

        # Generate new tokens
        tokens = generate_token(user_id=str(refresh_token.user_id))

        # Create refresh token expiration date
        days_added_from_now = datetime.timedelta(
            days=int(app_config.JWT_REFRESH_TOKEN_DURATION_DAYS),
        )

        refresh_token_expiration_date = func.now() + days_added_from_now

        # Save refresh token to auth tokens log
        session.add(
            AuthToken(
                user_id=refresh_token.user_id,
                refresh_token=tokens["refresh_token"],
                user_agent=request.headers.get("user-agent"),
                ip_address=request.client.host,
                expires_at=refresh_token_expiration_date,
            )
        )

        # Delete previous refresh token
        session.delete(refresh_token)

        # Commit transactions
        session.commit()

        return {
            "tokens": tokens,
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
            message="An error occurred during token refresh",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during token refresh" if app_config.ENV == "production" else str(e),
        )


def forgot_password_handler(request: Request, params: ForgotPasswordRequest, session: Session):
    try:
        # Validate request params
        if not params.email:
            raise ValueError("Email is required")
        elif not is_valid_email(params.email):
            raise ValueError("Invalid email format")

        # Check if email is exists
        user = session.query(
            User,
        ).filter(
            User.email == params.email,
            User.is_deleted == False,
        ).first()

        if not user:
            raise DataNotFoundError("Email not found")

        # Check if user is already verified
        if not user.is_verified:
            raise ValueError("User is not verified")

        # Check if user is active
        if not user.is_active:
            raise ValueError("User is not active")

        # Generate & save reset code
        reset_code = generate_random_code()
        user.reset_code = reset_code

        # Commit transactions
        session.commit()

        # Send email
        try:
            mail = Mail(
                sender=app_config.MAIL_SENDER,
                to=params.email,
                subject="Reset my password",
                message=f"Click link below to reset your password. Your reset code: {reset_code}.\n<a href='{app_config.FRONTEND_APP_URL}/reset-password?email={params.email}'>Reset password</a>",
            )

            mail.send()
        except Exception as e:
            log_error.add_error(
                message="An error occurred during forgot password: send email",
                exc_info=e,
            )

        return {
            "data": {
                "email": params.email,
                "status": "reset_code_sent",
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
            message="An error occurred during forgot password",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during forgot password" if app_config.ENV == "production" else str(e),
        )


def reset_password_handler(request: Request, params: ResetPasswordRequest, session: Session):
    try:
        # Validate request params
        if params.email == "":
            raise ValueError("Email is required")
        elif not is_valid_email(params.email):
            raise ValueError("Invalid email")

        if not params.code:
            raise ValueError("Code is required")

        if not params.new_password:
            raise ValueError("New password is required")

        if not params.confirm_password:
            raise ValueError("Confirm password is required")
        elif params.confirm_password != params.new_password:
            raise ValueError("Invalid confirm password")

        # Check if email is exists
        user = session.query(
            User,
        ).filter(
            User.email == params.email,
            User.is_deleted == False,
        ).first()

        if not user:
            raise DataNotFoundError("Email not found")

        # Check if user is active
        if not user.is_active:
            raise ValueError("User is not active")

        # Verify if user is verified
        if not user.is_verified:
            raise ValueError("User is not verified")

        # Verify reset code
        if user.reset_code == "" or user.reset_code != params.code:
            raise ValueError("Invalid code")

        # Encrypt new password
        hashed_new_password = encrypt_password(password=params.new_password)

        # Update user data
        user.password = hashed_new_password
        user.reset_code = ""

        # Commit transactions
        session.commit()

        return {
            "data": {
                "email": params.email,
                "status": "new_password_confirmed",
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
            message="An error occurred during reset password",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during reset password" if app_config.ENV == "production" else str(e),
        )


def confirm_account_handler(request: Request, params: ConfirmAccountRequest, session: Session):
    try:
        # Validate request params
        if not params.email:
            raise ValueError("Email is required")
        elif not is_valid_email(params.email):
            raise ValueError("Invalid email format")

        if not params.code:
            raise ValueError("Code is required")

        if not params.new_password:
            raise ValueError("New password is required")

        if not params.confirm_password:
            raise ValueError("Confirm password is required")
        elif params.confirm_password != params.new_password:
            raise ValueError("Invalid confirm password")

        # Check if email is exists
        user = session.query(
            User,
        ).filter(
            User.email == params.email,
            User.is_deleted == False,
        ).first()

        if not user:
            raise DataNotFoundError("Email not found")

        # Verify confirm code
        if user.verify_code == "" or user.verify_code != params.code:
            raise ValueError("Invalid code")

        # Encrypt new password
        hashed_new_password = encrypt_password(password=params.new_password)

        # Update user data
        user.password = hashed_new_password
        user.verify_code = ""
        user.verified_at = func.now()
        user.is_verified = True

        # Commit transactions
        session.commit()

        return {
            "data": {
                "email": params.email,
                "status": "account_confirmed",
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
            message="An error occurred during confirm account",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during confirm account" if app_config.ENV == "production" else str(e),
        )


def logout_handler(request: Request, params: LogoutRequest, payload: AuthPayload, session: Session):
    try:
        # Validate request params
        if not params.refresh_token:
            raise ValueError("Refresh token is required")

        # Verify refresh token
        refresh_token = session.query(
            AuthToken,
        ).filter(
            AuthToken.user_id == int(payload.user_id),
            AuthToken.refresh_token == params.refresh_token,
            AuthToken.expires_at > func.now(),
        ).first()

        if not refresh_token:
            raise UnauthorizedError("Invalid refresh token")

        # Delete refresh token
        session.delete(refresh_token)

        # Commit transactions
        session.commit()

        return {
            "data": {
                "status": "logged_out",
            },
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except UnauthorizedError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
    except Exception as e:
        session.rollback()

        log_error.add_error(
            message="An error occurred during logout",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during logout" if app_config.ENV == "production" else str(e),
        )


def logout_all_handler(request: Request, payload: AuthPayload, session: Session):
    try:
        # Delete all refresh tokens
        deleted_count = (
            session.query(
                AuthToken,
            ).filter(
                AuthToken.user_id == int(payload.user_id),
            ).delete(
                synchronize_session=False,
            )
        )

        # Commit transactions
        session.commit()

        return {
            "data": {
                "deleted_count": deleted_count,
                "status": "logged_out",
            },
        }
    except Exception as e:
        session.rollback()

        log_error.add_error(
            message="An error occurred during logout all",
            exc_info=e,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during logout all" if app_config.ENV == "production" else str(e),
        )
