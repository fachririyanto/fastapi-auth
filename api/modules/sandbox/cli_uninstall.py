from src.db import DB

from .schema import QUERY_DROP_TABLES


def sandbox_uninstall():
    # Drop the tables
    DB.execute(QUERY_DROP_TABLES)


sandbox_uninstall()
