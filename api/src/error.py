class UnauthorizedError(Exception):
    """Exception raised when user is not authorized"""
    def __init__(self, *args):
        super().__init__(*args)


class DataNotFoundError(Exception):
    """Exception raised when requested data is not found."""
    def __init__(self, *args):
        super().__init__(*args)
