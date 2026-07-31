import os
import json

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
app_dir = os.path.join(backend_dir, "app")
frontend_dir = os.path.join(root_dir, "frontend")

os.makedirs(app_dir, exist_ok=True)
os.makedirs(os.path.join(app_dir, "routers"), exist_ok=True)

# ------------------------------------------------------------------------------
# FASE 6 & 7: CONFIGURACIÓN DE BASE DE DATOS SQLALCHEMY (database.py)
# ------------------------------------------------------------------------------
db_config_code = """from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = "sqlite:///./marianix_database.db"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}
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
with open(os.path.join(app_dir, "database.py"), "w", encoding="utf-8") as f:
    f.write(db_config_code)

# ------------------------------------------------------------------------------
# FASE 1, 2, 8, 9, 10: FASTAPI MAIN CON LIFESPAN, HEALTH Y ROUTERS (main.py)
# ------------------------------------------------------------------------------
main_code = """import logging
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
"""
with open(os.path.join(app_dir, "main.py"), "w", encoding="utf-8") as f:
    f.write(main_code)

# ------------------------------------------------------------------------------
# FASE 3 & 4: VITE CONFIGURATION & PROXY (vite.config.ts / proxy.conf.json)
# ------------------------------------------------------------------------------
vite_code = """import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    port: 4200,
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
});
"""
with open(os.path.join(frontend_dir, "vite.config.ts"), "w", encoding="utf-8") as f:
    f.write(vite_code)

proxy_json = {
  "/api": {
    "target": "http://127.0.0.1:8000",
    "secure": False,
    "changeOrigin": True
  }
}
with open(os.path.join(frontend_dir, "proxy.conf.json"), "w", encoding="utf-8") as f:
    json.dump(proxy_json, f, indent=2)

print("✅ INFRAESTRUCTURA CORREGIDA Y ARCHIVOS GENERADOS CON ÉXITO.")
