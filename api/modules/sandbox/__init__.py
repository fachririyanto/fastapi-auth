from src.router import register_router
from src.services.role import register_capabilities

from .routes import sandbox_router
from .capabilities import sandbox_capabilities


def sandbox_init():
    # Register new capabilities
    register_capabilities(sandbox_capabilities)

    # Register new routes
    register_router(sandbox_router)


# Run module
sandbox_init()
