import logging
import datetime
import os


class LogError:

    def __init__(
            self,
            dirname="error_logs",
            file_prefix="api_errors",
            file_extension=".log",
        ):
        self.dirname = dirname
        self.file_prefix = file_prefix
        self.file_extension = file_extension
        self.logger = self._setup_logging()

    def _setup_logging(self):
        os.makedirs(self.dirname, exist_ok=True)

        timestamp = datetime.date.today().strftime("%Y%m%d_%H%M%S")
        log_file_name = f"{self.file_prefix}_{timestamp}{self.file_extension}"
        log_file_path = os.path.join(self.dirname, log_file_name)

        logger = logging.getLogger(__name__)
        logger.setLevel(logging.ERROR)

        file_handler = logging.FileHandler(log_file_path)
        file_handler.setLevel(logging.ERROR)

        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(formatter)

        logger.addHandler(file_handler)

        return logger

    def add_error(self, message, exc_info=None):
        """Logs an error message with optional exception information."""
        if exc_info:
            self.logger.error(message, exc_info=exc_info)
        else:
            self.logger.error(message)


log_error = LogError()
