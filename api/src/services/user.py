from sqlalchemy.orm import Session

from src.repository import User, RoleCapabilities


def superadmin_id() -> int:
    return 1


def is_superadmin(user_id: int) -> bool:
    return superadmin_id() == user_id


def is_user_can(session: Session, user_id: int, capabilities: list[str]) -> bool:
    try:
        # Get user's role
        user = session.query(User.role).filter(User.user_id == user_id).first()
        if not user:
            return False

        # Get role capabilities
        role_capabilities = session.query(RoleCapabilities.capability_id).filter(
            RoleCapabilities.role_id == user[0],
        ).all()

        # Check if the requested capabilities are present
        capability_ids = [cap[0] for cap in role_capabilities]
        if not any(cap in capability_ids for cap in capabilities):
            return False

        return True
    except Exception as e:
        raise e
