import bcrypt
import time

from jose import jwt, JWTError

from src.config import app_config
from src.models.auth import AuthPayload


def superadmin_id() -> int:
    """Get superadmin user_id"""
    return 1


def encrypt_password(password: str) -> str:
    """Encrypt password using bcrypt"""
    try:
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        return hashed.decode("utf-8")
    except Exception as e:
        raise e


def verify_password(password: str, hashed_password: str) -> bool:
    """Compare plain password with hashed password"""
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception as e:
        raise e


def generate_token(user_id: str) -> dict:
    """Generate access token and refresh token"""
    try:
        current_time = int(time.time())

        # create access token
        payload = {
            "sub": user_id,
            "iat": current_time,
            "exp": current_time + app_config.JWT_TOKEN_DURATION_MINUTES * 60,
        }

        access_token = jwt.encode(
            payload,
            app_config.JWT_SECRET_KEY,
            algorithm=app_config.JWT_ALGORITHM,
        )

        # create refresh token
        payload_refresh = {
            "sub": user_id,
            "iat": current_time,
            "exp": current_time + app_config.JWT_REFRESH_TOKEN_DURATION_DAYS * 24 * 60 * 60,
        }

        refresh_token = jwt.encode(
            payload_refresh,
            app_config.JWT_SECRET_KEY,
            algorithm=app_config.JWT_ALGORITHM,
        )

        hashed_refresh_token = encrypt_password(refresh_token)

        return {
            "access_token": access_token,
            "refresh_token": hashed_refresh_token,
            "token_type": "bearer",
        }
    except JWTError as err:
        raise err


def verify_token(token: str) -> AuthPayload:
    """Verify token by returning payload"""
    try:
        payload = jwt.decode(
            token,
            app_config.JWT_SECRET_KEY,
            algorithms=app_config.JWT_ALGORITHM,
        )

        return AuthPayload(
            user_id=payload.get("sub"),
        )
    except JWTError as err:
        raise err
