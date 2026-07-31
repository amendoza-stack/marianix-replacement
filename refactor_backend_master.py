import os

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
app_dir = os.path.join(backend_dir, "app")
routers_dir = os.path.join(app_dir, "routers")

os.makedirs(routers_dir, exist_ok=True)

# Helper para construir routers con firmas REST puras y compatibilidad DB/Session
def make_rest_router(prefix: str, tag: str, endpoints: list):
    code = f"""from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="{prefix}", tags=["{tag}"])

DB_STORE: Dict[str, Dict[int, Any]] = {{}}
"""
    for ep, name in endpoints:
        dict_key = ep if ep else "bonificaciones"
        clean_ep = ep.replace('-', '_') if ep else "bonificaciones"
        route_path = f"/{ep}" if ep else ""

        code += f"""
DB_STORE["{dict_key}"] = {{1: {{"id": 1, "nombre": "{name} Ejemplo 1", "descripcion": "{name} Ejemplo 1", "activo": True}}}}

@router.get("{route_path}")
def list_{clean_ep}(db: Session = Depends(get_db)):
    return list(DB_STORE["{dict_key}"].values())

@router.get("{route_path}/{{item_id}}")
def get_{clean_ep}(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["{dict_key}"]:
        return DB_STORE["{dict_key}"][item_id]
    raise HTTPException(status_code=404, detail="{name} no encontrado")

@router.post("{route_path}", status_code=201)
def create_{clean_ep}(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["{dict_key}"]) + 100
    record = {{"id": new_id, **data}}
    DB_STORE["{dict_key}"][new_id] = record
    return record

@router.put("{route_path}/{{item_id}}")
def update_{clean_ep}(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["{dict_key}"]:
        DB_STORE["{dict_key}"][item_id].update(data)
        return DB_STORE["{dict_key}"][item_id]
    record = {{"id": item_id, **data}}
    DB_STORE["{dict_key}"][item_id] = record
    return record

@router.delete("{route_path}/{{item_id}}")
def delete_{clean_ep}(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["{dict_key}"]:
        del DB_STORE["{dict_key}"][item_id]
    return {{"status": "deleted", "id": item_id}}
"""
    return code

# 1. GENERACIÓN DE ROUTERS REST LIMPIOS
config_eps = [
    ("paises", "País"), ("provincias", "Provincia"), ("ubicaciones", "Ubicación"),
    ("zonas", "Zona"), ("colegios-farmaceuticos", "Colegio Farmacéutico"),
    ("categorias-medicamentos", "Categoría"), ("tipos-patologias", "Patología"),
    ("especialidades-medicas", "Especialidad"), ("observaciones", "Observación"),
    ("vinculos", "Vínculo"), ("periodos", "Período"), ("droguerias", "Droguería")
]
with open(os.path.join(routers_dir, "configuracion.py"), "w", encoding="utf-8") as f:
    f.write(make_rest_router("/api/v1/config", "Configuración", config_eps))

with open(os.path.join(routers_dir, "seguridad.py"), "w", encoding="utf-8") as f:
    f.write(make_rest_router("/api/v1/seguridad", "Seguridad", [("usuarios", "Usuario"), ("roles", "Rol")]))

with open(os.path.join(routers_dir, "medica.py"), "w", encoding="utf-8") as f:
    f.write(make_rest_router("/api/v1/medica", "Gestión Médica", [("afiliados", "Afiliado"), ("medicos", "Médico")]))

salud_eps = [("obras-sociales", "Obra Social"), ("planes", "Plan"), ("farmacias-os", "Farmacia OS"), ("laboratorios", "Laboratorio"), ("farmacias", "Farmacia")]
with open(os.path.join(routers_dir, "salud_ext.py"), "w", encoding="utf-8") as f:
    f.write(make_rest_router("/api/v1/salud", "Gestión Salud Ext", salud_eps))

meds_eps = [
    ("drogas", "Droga"), ("monodrogas", "Monodroga"), ("potencias", "Potencia"),
    ("formas", "Forma Farmacéutica"), ("vias", "Vía Administración"),
    ("acciones", "Acción Terapéutica"), ("maestro", "Maestro Medicamento")
]
with open(os.path.join(routers_dir, "medicamentos.py"), "w", encoding="utf-8") as f:
    f.write(make_rest_router("/api/v1/medicamentos", "Medicamentos", meds_eps))

with open(os.path.join(routers_dir, "bonificaciones.py"), "w", encoding="utf-8") as f:
    f.write(make_rest_router("/api/v1/bonificaciones", "Bonificaciones", [("", "Bonificación")]))

# 2. CONSOLIDACIÓN DE MAIN.PY CON TODOS LOS ROUTERS REGISTRADOS
main_code = """from fastapi import FastAPI
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

# REGISTRO DE ROUTERS EN LA APLICACIÓN
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

with open(os.path.join(app_dir, "main.py"), "w", encoding="utf-8") as f:
    f.write(main_code)

print("✅ Refactorización y registro completo finalizado exitosamente.")
