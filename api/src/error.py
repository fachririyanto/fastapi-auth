class UnauthorizedError(Exception):
    """Exception raised when user is not authorized"""
    def __init__(self, *args):
        super().__init__(*args)


class ForbiddenError(Exception):
    """Exception raised when user does not have permission to access a resource."""
    def __init__(self, *args):
        super().__init__(*args)


class DataNotFoundError(Exception):
    """Exception raised when requested data is not found."""
    def __init__(self, *args):
        super().__init__(*args)


ERROR_MESSAGES = {
    "unauthorized": "Unauthorized",
    "forbidden": "You do not have permission to access this resource",
}
