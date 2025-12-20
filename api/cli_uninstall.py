import argparse

from importlib import import_module

from startup import registered_modules
from src.db import DB
from src.db.schema import QUERY_DROP_TABLES


def uninstall_app():
    global registered_modules

    try:
        # Setup args
        parser = argparse.ArgumentParser(description="Uninstall with parameters.")
        parser.add_argument("--module", help="Name of module do you want to uninstall.", required=False)

        # Get module name
        args = parser.parse_args()
        module_name = args.module

        if module_name:
            # Uninstall selected module
            import_module(f"modules.{module_name}.cli_uninstall")

            # Print uninstalled message
            print(f"Module {module_name} uninstalled")
        else:
            # Drop tables and initial data
            DB.execute(QUERY_DROP_TABLES)

            # Uninstall all registered module
            for module in registered_modules:
                import_module(f"modules.{module}.cli_uninstall")

            # Print uninstalled message
            print("Modules are uninstalled")
    except ImportError as e:
        print(f"Error installing module: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


uninstall_app()
