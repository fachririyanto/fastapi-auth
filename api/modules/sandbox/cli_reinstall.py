from src.db import DB

from .schema import QUERY_CREATE_TABLES, QUERY_INSERT_DATA, QUERY_DROP_TABLES


def sandbox_reinstall():
    # Reinstall the tables
    DB.execute(
        QUERY_DROP_TABLES
        + QUERY_CREATE_TABLES
        + QUERY_INSERT_DATA
    )


sandbox_reinstall()
