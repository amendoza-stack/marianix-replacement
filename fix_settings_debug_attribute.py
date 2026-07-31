import os

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
app_dir = os.path.join(backend_dir, "app")
core_dir = os.path.join(app_dir, "core")

# 1. REPARAR app/core/config.py AGREGANDO ATRIBUTO 'DEBUG'
config_path = os.path.join(core_dir, "config.py")

config_code = """from pydantic_settings import BaseSettings, SettingsConfigDict
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
"""

with open(config_path, "w", encoding="utf-8") as f:
    f.write(config_code)

# 2. REPARAR app/core/database.py PARA USAR FALLBACK SEGURO (getattr)
database_path = os.path.join(core_dir, "database.py")
if os.path.exists(database_path):
    with open(database_path, "r", encoding="utf-8") as f:
        db_content = f.read()
    
    # Reemplazar acceso directo unsafe por getattr seguro
    db_content = db_content.replace("settings.DEBUG", "getattr(settings, 'DEBUG', True)")
    
    with open(database_path, "w", encoding="utf-8") as f:
        f.write(db_content)

print("✅ Configuración de Settings corregida. Atributo DEBUG agregado exitosamente.")
