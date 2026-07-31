import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from app.database import engine, Base
from app.routers import obras_sociales, laboratorios

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("marianix_infra")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Inicializando Infraestructura Backend y tablas SQLite...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Tablas de SQLite creadas/verificadas exitosamente.")
    except Exception as e:
        logger.error(f"❌ Error crítico inicializando SQLite: {str(e)}", exc_info=True)
    yield
    logger.info("🛑 Apagando backend...")

app = FastAPI(
    title="Marianix API",
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
    logger.info(f"➡️ Petición: {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        logger.info(f"⬅️ Respuesta: {request.method} {request.url.path} - {response.status_code} ({process_time:.2f}ms)")
        return response
    except Exception as exc:
        logger.error(f"❌ Error no capturado en {request.method} {request.url.path}: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal Server Error", "error": str(exc)}
        )

# HEALTH CHECK
@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {"status": "ok", "system": "Marianix Auditoría", "timestamp": time.time()}

app.include_router(obras_sociales.router)
app.include_router(laboratorios.router)
