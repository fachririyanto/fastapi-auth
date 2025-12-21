from sqlalchemy import (
    Column,
    String,
    DateTime,
    BigInteger,
    ForeignKey,
)

from sqlalchemy.sql import func

from src.db import Base


class Sandbox(Base):
    __tablename__ = "sandbox"

    sandbox_id = Column(BigInteger, autoincrement=True, primary_key=True, nullable=False, index=True)
    sandbox_name = Column(String(50), nullable=False)
    created_by = Column(BigInteger, ForeignKey("users.user_id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
