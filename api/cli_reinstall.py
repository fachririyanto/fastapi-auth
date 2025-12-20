import argparse

from importlib import import_module

from startup import registered_modules
from src.db import DB
from src.db.schema import QUERY_DROP_TABLES, QUERY_CREATE_TABLES, QUERY_INSERT_DATA


def reinstall_app():
    global registered_modules

    try:
        # Setup args
        parser = argparse.ArgumentParser(description="Reinstall with parameters.")
        parser.add_argument("--module", help="Name of module do you want to reinstall.", required=False)

        # Get module name
        args = parser.parse_args()
        module_name = args.module

        if module_name:
            # Reinstall selected module
            import_module(f"modules.{module_name}.cli_reinstall")

            # Print reinstalled message
            print(f"Module {module_name} reinstalled")
        else:
            # Reinstall tables and initial data
            DB.execute(
                QUERY_DROP_TABLES
                + QUERY_CREATE_TABLES
                + QUERY_INSERT_DATA
            )

            # Reinstall all registered module
            for module in registered_modules:
                import_module(f"modules.{module}.cli_reinstall")

            # Print reinstalled message
            print("Modules are reinstalled")
    except ImportError as e:
        print(f"Error installing module: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


reinstall_app()
