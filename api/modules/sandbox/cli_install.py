from src.db import DB

from .schema import QUERY_CREATE_TABLES, QUERY_INSERT_DATA


def sandbox_install():
    # Check if table is installed
    if not DB.is_table_exists("sandbox"):
        # Install tables
        DB.execute(
            QUERY_CREATE_TABLES
            + QUERY_INSERT_DATA
        )


sandbox_install()
