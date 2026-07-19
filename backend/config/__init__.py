from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_ENV: str = "dev"
    APP_BASE_URL: str = "http://localhost:8000"

    USE_SQLITE: bool = False
    SQLITE_DB_PATH: str = "gpap_dev.sqlite3"

    MYSQL_HOST: str = "127.0.0.1"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "gpap"
    MYSQL_PASSWORD: str = "gpap123"
    MYSQL_DB: str = "gpap"

    JWT_SECRET: str = "dev-secret-key"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 120

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

