import os

main_path = r"C:\Users\aname\marianix-replacement\backend\app\main.py"

main_content = """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    auth,
    configuracion,
    seguridad,
    medica,
    salud_ext,
    medicamentos,
    bonificaciones,
    exportaciones,
    importaciones
)

app = FastAPI(
    title="FarmakD ERP - API REST",
    version="1.0.0",
    docs_url="/api/v1/docs",
    openapi_url="/api/v1/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(configuracion.router)
app.include_router(seguridad.router)
app.include_router(medica.router)
app.include_router(salud_ext.router)
app.include_router(medicamentos.router)
app.include_router(bonificaciones.router)
app.include_router(exportaciones.router)
app.include_router(importaciones.router)

@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {"status": "ok", "system": "FarmakD ERP API", "version": "1.0.0"}
"""

with open(main_path, "w", encoding="utf-8") as f:
    f.write(main_content)

print("✅ main.py consolidado y actualizado.")
