import logging
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
from app.routers import permisos
app.include_router(permisos.router)
