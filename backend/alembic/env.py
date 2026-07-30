import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# 1. Agregar el directorio raíz del backend al PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# 2. Importar la Base de los modelos y las configuraciones de la app
from app.core.config import settings
from app.core.database import Base
import app.models  # Forzar carga de todos los modelos SQLAlchemy (Auth + Domain)

# Objeto Config de Alembic
config = context.config

# Interpretar el archivo de configuración para logging
if config.config_file_name:
    fileConfig(config.config_file_name)

# Asignar los metadatos de las entidades para autogenerar migraciones
target_metadata = Base.metadata

def get_url():
    """Recupera la cadena de conexión de .env (SQLite o MySQL)."""
    return settings.DATABASE_URL

def run_migrations_offline() -> None:
    """Ejecuta migraciones en modo 'offline' (generación de scripts SQL directos)."""
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        render_as_batch=True  # Soporte para migraciones complejas en SQLite
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Ejecuta migraciones en modo 'online' conectando directamente a la BD."""
    configuration = config.get_section(config.config_ini_section) or {}
    configuration["sqlalchemy.url"] = get_url()

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    is_sqlite = "sqlite" in get_url()

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            render_as_batch=is_sqlite  # Habilita batch mode solo para SQLite
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()