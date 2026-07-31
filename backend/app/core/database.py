from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Session
from app.core.config import settings

# Ajuste automático de parámetros según el motor de base de datos
connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=getattr(settings, 'DEBUG', True),
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    """Clase Base para todos los modelos ORM de SQLAlchemy 2.0"""
    pass

def get_db() -> Generator[Session, None, None]:
    """Inyector de dependencia para sesiones de base de datos en endpoints"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
