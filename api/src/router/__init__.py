from fastapi import FastAPI, APIRouter

from .auth.routes import auth_router
from .account.routes import account_router
from .role.routes import role_router
from .user.routes import user_router


# Global app routers variable
app_routers = [
    auth_router,
    account_router,
    role_router,
    user_router,
]


def register_router(router: APIRouter):
    """Append new router into global app routers"""
    global app_routers
    app_routers.append(router)


def load_routers(app: FastAPI):
    """Load all registered routers"""
    global app_routers

    for route in app_routers:
        app.include_router(router=route)

    return app
