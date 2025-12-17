import os

from dotenv import load_dotenv


load_dotenv()


class AppConfig:
    # Env
    ENV: str = os.getenv("ENV", "development")

    # DB URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")

    # JWT Secret Key
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key_here")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_TOKEN_DURATION_MINUTES: int = int(os.getenv("JWT_TOKEN_DURATION_MINUTES", "10"))
    JWT_REFRESH_TOKEN_DURATION_DAYS: int = int(os.getenv("JWT_REFRESH_TOKEN_DURATION_DAYS", "7"))

    # Mail
    MAIL_SENDER: str = os.getenv("MAIL_SENDER", "noreply@example.ai")

    # SMTP
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: str = os.getenv("SMTP_PORT", "465")
    SMTP_USER: str = os.getenv("SMTP_USER", "example@gmail.com")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "your_password")

    # Frontend
    FRONTEND_APP_URL: str = os.getenv("FRONTEND_APP_URL", "http://localhost:5173")


app_config = AppConfig()
