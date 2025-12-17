from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError

from src.config import app_config
from src.models.auth import AuthPayload
from src.services.auth import verify_token


security = HTTPBearer(auto_error=False)

def authorize_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> AuthPayload:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token is missing",
        )

    token = credentials.credentials

    try:
        return verify_token(token=token)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e) if app_config.ENV != "production" else "Unauthorized",
        )
