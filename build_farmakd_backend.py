import os
import json

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
app_dir = os.path.join(backend_dir, "app")

# Estructura de carpetas
dirs = [
    "api", "core", "database", "models", "schemas", 
    "repositories", "services", "security", "middlewares", 
    "dependencies", "utils", "routers", "tests"
]
for d in dirs:
    os.makedirs(os.path.join(app_dir, d), exist_ok=True)

# 1. CORE CONFIGURATION (core/config.py)
config_code = """from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "FarmakD Backend API"
    VERSION: str = "3.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./farmakd.db"
    # Para migrar a MySQL simplemente reemplazar la variable de entorno por:
    # DATABASE_URL: str = "mysql+pymysql://user:password@localhost:3306/farmakd_db"
    
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
with open(os.path.join(app_dir, "core", "config.py"), "w", encoding="utf-8") as f:
    f.write(config_code)

# 2. DATABASE CONFIGURATION (database/session.py)
db_code = """from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
"""
with open(os.path.join(app_dir, "database", "session.py"), "w", encoding="utf-8") as f:
    f.write(db_code)

# 3. REPOSITORIO GENÉRICO TRANSACCIONAL (repositories/base_repository.py)
repo_code = """import logging
from sqlalchemy.orm import Session
from typing import TypeVar, Generic, Type, List, Optional, Any

logger = logging.getLogger("farmakd_repository")
T = TypeVar("T")

class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T], db: Session):
        self.model = model
        self.db = db

    def get_all(self, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[T]:
        query = self.db.query(self.model)
        if active_only and hasattr(self.model, 'activo'):
            query = query.filter(self.model.activo == True)
        return query.offset(skip).limit(limit).all()

    def get_by_id(self, item_id: Any) -> Optional[T]:
        return self.db.query(self.model).filter(self.model.id == item_id).first()

    def create(self, entity: T) -> T:
        try:
            self.db.add(entity)
            self.db.commit()
            self.db.refresh(entity)
            logger.info(f"✅ Transaction Commit: {self.model.__tablename__} insertado ID {getattr(entity, 'id', None)}")
            return entity
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Transaction Rollback en CREATE [{self.model.__tablename__}]: {str(e)}")
            raise e

    def update(self, item_id: Any, updates: dict) -> Optional[T]:
        try:
            entity = self.get_by_id(item_id)
            if not entity:
                return None
            for key, value in updates.items():
                if hasattr(entity, key) and value is not None:
                    setattr(entity, key, value)
            self.db.commit()
            self.db.refresh(entity)
            logger.info(f"✅ Transaction Commit: {self.model.__tablename__} actualizado ID {item_id}")
            return entity
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Transaction Rollback en UPDATE ID {item_id}: {str(e)}")
            raise e

    def delete_logic(self, item_id: Any) -> bool:
        try:
            entity = self.get_by_id(item_id)
            if not entity:
                return False
            if hasattr(entity, 'activo'):
                entity.activo = False
            else:
                self.db.delete(entity)
            self.db.commit()
            logger.info(f"✅ Transaction Commit: {self.model.__tablename__} baja lógica ID {item_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Transaction Rollback en DELETE ID {item_id}: {str(e)}")
            raise e
"""
with open(os.path.join(app_dir, "repositories", "base_repository.py"), "w", encoding="utf-8") as f:
    f.write(repo_code)

print("✅ Módulos base de Arquitectura FarmakD (Config, Session, BaseRepository) inicializados correctamente.")
