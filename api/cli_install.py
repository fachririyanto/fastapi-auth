import argparse

from importlib import import_module

from startup import registered_modules
from src.db import DB
from src.db.schema import QUERY_CREATE_TABLES, QUERY_INSERT_DATA


def install_app():
    global registered_modules

    try:
        # Setup args
        parser = argparse.ArgumentParser(description="Install with parameters.")
        parser.add_argument("--module", help="Name of module do you want to install.", required=False)

        # Get module name
        args = parser.parse_args()
        module_name = args.module

        if module_name:
            # Install selected module
            import_module(f"modules.{module_name}._cli_install")

            # Print installed message
            print(f"Module {module_name} installed")
        else:
            # Check if table is installed
            if not DB.is_table_exists("users"):
                # Install tables and initial data
                DB.execute(
                    QUERY_CREATE_TABLES
                    + QUERY_INSERT_DATA
                )

            # Install all registered module
            for module in registered_modules:
                import_module(f"modules.{module}._cli_install")

            # Print installed message
            print("Modules are installed")
    except ImportError as e:
        print(f"Error installing module: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


install_app()
