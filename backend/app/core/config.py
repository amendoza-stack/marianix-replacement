from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "FarmakD Backend API"
    VERSION: str = "3.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Flags de Infraestructura
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./farmakd.db"
    
    # JWT
    SECRET_KEY: str = "FAKED_SECRET_KEY_SUPER_SECURE_987654321_LAFKEN26"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    
    # Superadmin
    SUPERUSER_NAME: str = "anamendoza"
    SUPERUSER_EMAIL: str = "amendoza@farmakd.com"
    SUPERUSER_PASS: str = "Lafken26"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
