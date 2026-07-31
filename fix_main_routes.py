import os

backend_dir = r"C:\Users\aname\marianix-replacement\backend"
app_dir = os.path.join(backend_dir, "app")

main_py_code = """import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("marianix_backend")

app = FastAPI(
    title="Marianix API Auditoría Médica",
    version="2.4.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs"
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
    logger.info(f"➡️ {request.method} {request.url.path}")
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    logger.info(f"⬅️ {request.method} {request.url.path} - {response.status_code} ({process_time:.2f}ms)")
    return response

@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {"status": "ok", "system": "Marianix Auditoria", "timestamp": time.time()}

# Routers
from app.routers import obras_sociales, laboratorios
app.include_router(obras_sociales.router)
app.include_router(laboratorios.router)
"""

with open(os.path.join(app_dir, "main.py"), "w", encoding="utf-8") as f:
    f.write(main_py_code)

print("✅ main.py actualizado con rutas /health y /api/v1/salud/laboratorios registradas.")
