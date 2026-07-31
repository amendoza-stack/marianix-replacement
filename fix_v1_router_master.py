import os

router_path = r"C:\Users\aname\marianix-replacement\backend\app\api\v1\router.py"

content = """from fastapi import APIRouter

# Importación de endpoints nativos de API v1
from app.api.v1.endpoints import auth, health

# Importación de routers por módulo funcional
from app.routers import (
    configuracion,
    seguridad,
    medica,
    salud_ext,
    medicamentos,
    bonificaciones,
    exportaciones,
    importaciones
)

api_router = APIRouter()

# 1. Endpoints Base
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Autenticación"])

# 2. Routers de Módulos ERP (Registrados bajo API v1)
api_router.include_router(configuracion.router)
api_router.include_router(seguridad.router)
api_router.include_router(medica.router)
api_router.include_router(salud_ext.router)
api_router.include_router(medicamentos.router)
api_router.include_router(bonificaciones.router)
api_router.include_router(exportaciones.router)
api_router.include_router(importaciones.router)
"""

with open(router_path, "w", encoding="utf-8") as f:
    f.write(content)

print("✅ backend/app/api/v1/router.py unificado y reescrito con la totalidad de sub-routers.")
