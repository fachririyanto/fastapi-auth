from importlib import import_module


# Register modules
registered_modules = []

def load_modules():
    global registered_modules

    if len(registered_modules) > 0:
        for module in registered_modules:
            import_module(f"modules.{module}")
