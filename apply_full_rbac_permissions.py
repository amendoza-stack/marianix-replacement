import os

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
app_dir = os.path.join(backend_dir, "app")
routers_dir = os.path.join(app_dir, "routers")
models_dir = os.path.join(app_dir, "models")
services_dir = os.path.join(app_dir, "services")

os.makedirs(models_dir, exist_ok=True)
os.makedirs(services_dir, exist_ok=True)

# 1. CREAR MODELO DE SEGURIDAD (models/seguridad.py)
seguridad_model_code = """from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

rol_permisos = Table(
    'rol_permisos',
    Base.metadata,
    Column('rol_id', Integer, ForeignKey('roles.id', ondelete="CASCADE"), primary_key=True),
    Column('permiso_id', Integer, ForeignKey('permisos.id', ondelete="CASCADE"), primary_key=True)
)

class Permiso(Base):
    __tablename__ = 'permisos'

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(150), unique=True, nullable=False, index=True)
    nombre = Column(String(150), nullable=False)
    modulo = Column(String(100), nullable=False, index=True)
    accion = Column(String(50), nullable=False, index=True)
    descripcion = Column(String(255), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    roles = relationship("Rol", secondary=rol_permisos, back_populates="permisos")

class Rol(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False)
    descripcion = Column(String(255), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)

    permisos = relationship("Permiso", secondary=rol_permisos, back_populates="roles")
"""

with open(os.path.join(models_dir, "seguridad.py"), "w", encoding="utf-8") as f:
    f.write(seguridad_model_code)

with open(os.path.join(models_dir, "__init__.py"), "w", encoding="utf-8") as f:
    f.write("from .seguridad import Permiso, Rol\n")

# 2. CREAR SERVICIO DE SEED / SINCRONIZACIÓN AUTOMÁTICA DE PERMISOS
perm_seed_code = """import logging
from sqlalchemy.orm import Session
from app.models.seguridad import Permiso, Rol
from app.database import SessionLocal

logger = logging.getLogger("marianix_permissions")

ACCIONES = [
    ("CONSULTAR", "Consultar registros"),
    ("CREAR", "Crear registros"),
    ("MODIFICAR", "Modificar registros"),
    ("ELIMINAR", "Eliminar registros"),
    ("EXPORTAR_EXCEL", "Exportar Excel"),
    ("EXPORTAR_CSV", "Exportar CSV"),
    ("IMPORTAR", "Importar datos"),
    ("ADMINISTRAR", "Administración total")
]

MODULOS = {
    "SEGURIDAD": ["Usuarios", "Roles", "Permisos"],
    "CONFIGURACION": ["Paises", "Provincias", "Ubicaciones", "Zonas", "Colegios Farmaceuticos", "Categorias Medicamentos", "Tipos Patologias", "Especialidades Medicas", "Observaciones", "Vinculos", "Periodos", "Droguerias"],
    "GESTION_MEDICA": ["Afiliados", "Medicos"],
    "GESTION_SALUD": ["Obras Sociales", "Planes", "Farmacias OS", "Plan Monodroga", "Laboratorios", "Farmacias", "Relacion Colegio Farmacia"],
    "MEDICAMENTOS": ["Drogas", "Monodrogas", "Potencias", "Formas Farmaceuticas", "Vias de Administracion", "Acciones Terapeuticas", "Maestro Medicamentos", "Importador de Novedades"],
    "BONIFICACIONES": ["Bonificaciones", "Exportacion Oficial"],
    "REPORTES": ["Reporte Bonificaciones", "Reporte Farmacias", "Reporte Recetas", "Reporte 331"],
    "DASHBOARD": ["Dashboard", "KPIs"],
    "AUDITORIA": ["Logs", "Auditoria"]
}

def sync_permissions_and_roles():
    db = SessionLocal()
    try:
        logger.info("⚡ Sincronizando Matriz Maestro de Permisos...")
        total_created = 0
        for grupo, submodulos in MODULOS.items():
            for submod in submodulos:
                mod_key = f"{grupo}_{submod.upper().replace(' ', '_')}"
                for acc_key, acc_desc in ACCIONES:
                    perm_code = f"{mod_key}_{acc_key}"
                    perm_name = f"{submod} - {acc_key.capitalize().replace('_', ' ')}"
                    
                    existing = db.query(Permiso).filter(Permiso.codigo == perm_code).first()
                    if not existing:
                        new_perm = Permiso(
                            codigo=perm_code,
                            nombre=perm_name,
                            modulo=mod_key,
                            accion=acc_key,
                            descripcion=f"Permiso para {acc_desc} en {submod}",
                            activo=True
                        )
                        db.add(new_perm)
                        total_created += 1

        db.commit()
        logger.info(f"✅ Matriz de Permisos Sincronizada. Permisos nuevos creados: {total_created}")

        # Sincronizar Rol Administrador
        all_perms = db.query(Permiso).filter(Permiso.activo == True).all()
        admin_role = db.query(Rol).filter(Rol.nombre == "Administrador").first()
        if not admin_role:
            admin_role = Rol(nombre="Administrador", descripcion="Control total del sistema ERP")
            db.add(admin_role)
            db.commit()
        admin_role.permisos = all_perms
        db.commit()

    except Exception as e:
        db.rollback()
        logger.error(f"❌ Error durante la sincronización de permisos: {str(e)}")
    finally:
        db.close()
"""

with open(os.path.join(services_dir, "permisos_seed.py"), "w", encoding="utf-8") as f:
    f.write(perm_seed_code)

# 3. ACTUALIZAR APP/MAIN.PY PARA INCLUIR LA SINCRONIZACIÓN EN LIFESPAN
main_code = """import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from app.database import engine, Base
from app.routers import obras_sociales, laboratorios
from app.services.permisos_seed import sync_permissions_and_roles

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("marianix_infra")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Inicializando Infraestructura Backend, tablas SQLite y Matriz RBAC...")
    try:
        Base.metadata.create_all(bind=engine)
        sync_permissions_and_roles()
        logger.info("✅ Tablas de SQLite y Matriz de Permisos cargadas exitosamente.")
    except Exception as e:
        logger.error(f"❌ Error durante el arranque del Backend: {str(e)}", exc_info=True)
    yield
    logger.info("🛑 Apagando backend...")

app = FastAPI(
    title="Marianix API Auditoría Médica",
    version="2.4.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        logger.error(f"❌ Error en {request.method} {request.url.path}: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal Server Error", "error": str(exc)}
        )

@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {"status": "ok", "system": "Marianix Auditoría", "timestamp": time.time()}

app.include_router(obras_sociales.router)
app.include_router(laboratorios.router)
"""

with open(os.path.join(app_dir, "main.py"), "w", encoding="utf-8") as f:
    f.write(main_code)

print("🚀 SCRIPT DE IMPLEMENTACIÓN DE RBAC EJECUTADO CORRECTAMENTE.")
