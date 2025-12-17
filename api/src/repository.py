from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    Boolean,
    BigInteger,
    Text,
    ForeignKey,
)

from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func

from src.db import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(BigInteger, autoincrement=True, primary_key=True, nullable=False, index=True)
    email = Column(String(50), nullable=False)
    password = Column(String(100), nullable=False)
    full_name = Column(String(50), nullable=False)
    role = Column(Integer, nullable=False)
    metadata_ = Column("metadata", JSONB)
    created_by = Column(BigInteger, nullable=False)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    reset_code = Column(String(20))
    verify_code = Column(String(20))
    verified_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Role(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, autoincrement=True, primary_key=True, nullable=False, index=True)
    role_name = Column(String(30), nullable=False)
    created_by = Column(BigInteger, ForeignKey("users.user_id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_deleted = Column(Boolean, default=False)


class RoleCapabilities(Base):
    __tablename__ = "role_capabilities"

    role_id = Column(Integer, ForeignKey("roles.role_id"), nullable=False, primary_key=True)
    capability_id = Column(String(50), nullable=False, primary_key=True)


class AuthToken(Base):
    __tablename__ = "auth_tokens"

    auth_id = Column(BigInteger, autoincrement=True, primary_key=True, nullable=False, index=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id"), nullable=False)
    refresh_token = Column(Text, nullable=False)
    user_agent = Column(Text, nullable=True)
    ip_address = Column(String(30), nullable=True)
    log_metadata = Column("metadata", JSONB)
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
