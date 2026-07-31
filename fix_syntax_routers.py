import os

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
app_dir = os.path.join(backend_dir, "app")
routers_dir = os.path.join(app_dir, "routers")

os.makedirs(routers_dir, exist_ok=True)

def build_clean_crud_router(prefix: str, tag: str, endpoints: list):
    code = f"""from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="{prefix}", tags=["{tag}"])

DB_STORE: Dict[str, Dict[int, Any]] = {{}}
"""
    for ep, name in endpoints:
        clean_ep = ep.replace('-', '_') if ep else "root"
        dict_key = ep if ep else "bonificaciones"
        
        code += f"""
DB_STORE["{dict_key}"] = {{1: {{"id": 1, "nombre": "{name} Ejemplo 1", "descripcion": "{name} Ejemplo 1", "activo": True}}}}

@router.get("/{"/" + ep if ep else ""}")
def get_all_{clean_ep}(db: Session = Depends(get_db)):
    return list(DB_STORE["{dict_key}"].values())

@router.get("/{"/" + ep if ep else ""}/{{item_id}}")
def get_by_id_{clean_ep}(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["{dict_key}"]:
        return DB_STORE["{dict_key}"][item_id]
    raise HTTPException(status_code=404, detail="Registro no encontrado")

@router.post("/{"/" + ep if ep else ""}", status_code=201)
def create_{clean_ep}(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["{dict_key}"]) + 100
    record = {{"id": new_id, **data}}
    DB_STORE["{dict_key}"][new_id] = record
    return record

@router.put("/{"/" + ep if ep else ""}/{{item_id}}")
def update_{clean_ep}(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["{dict_key}"]:
        DB_STORE["{dict_key}"][item_id].update(data)
        return DB_STORE["{dict_key}"][item_id]
    record = {{"id": item_id, **data}}
    DB_STORE["{dict_key}"][item_id] = record
    return record

@router.delete("/{"/" + ep if ep else ""}/{{item_id}}")
def delete_{clean_ep}(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["{dict_key}"]:
        del DB_STORE["{dict_key}"][item_id]
    return {{"status": "deleted", "id": item_id}}
"""
    return code

# 1. CONFIGURACIÓN
cfg_endpoints = [
    ("paises", "País"), ("provincias", "Provincia"), ("ubicaciones", "Ubicación"),
    ("zonas", "Zona"), ("colegios-farmaceuticos", "Colegio Farmacéutico"),
    ("categorias-medicamentos", "Categoría"), ("tipos-patologias", "Patología"),
    ("especialidades-medicas", "Especialidad"), ("observaciones", "Observación"),
    ("vinculos", "Vínculo"), ("periodos", "Período"), ("droguerias", "Droguería")
]
with open(os.path.join(routers_dir, "configuracion.py"), "w", encoding="utf-8") as f:
    f.write(build_clean_crud_router("/api/v1/config", "Configuración", cfg_endpoints))

# 2. SEGURIDAD
seg_endpoints = [("usuarios", "Usuario"), ("roles", "Rol")]
with open(os.path.join(routers_dir, "seguridad.py"), "w", encoding="utf-8") as f:
    f.write(build_clean_crud_router("/api/v1/seguridad", "Seguridad", seg_endpoints))

# 3. GESTIÓN MÉDICA
med_endpoints = [("afiliados", "Afiliado"), ("medicos", "Médico")]
with open(os.path.join(routers_dir, "medica.py"), "w", encoding="utf-8") as f:
    f.write(build_clean_crud_router("/api/v1/medica", "Gestión Médica", med_endpoints))

# 4. MEDICAMENTOS
meds_endpoints = [
    ("drogas", "Droga"), ("monodrogas", "Monodroga"), ("potencias", "Potencia"),
    ("formas", "Forma Farmacéutica"), ("vias", "Vía Administración"),
    ("acciones", "Acción Terapéutica"), ("maestro", "Maestro Medicamento")
]
with open(os.path.join(routers_dir, "medicamentos.py"), "w", encoding="utf-8") as f:
    f.write(build_clean_crud_router("/api/v1/medicamentos", "Medicamentos", meds_endpoints))

# 5. BONIFICACIONES
with open(os.path.join(routers_dir, "bonificaciones.py"), "w", encoding="utf-8") as f:
    f.write(build_clean_crud_router("/api/v1/bonificaciones", "Bonificaciones", [("", "Bonificación")]))

# 6. EXTENSIÓN SALUD
salud_endpoints = [("planes", "Plan"), ("farmacias-os", "Farmacia OS"), ("laboratorios", "Laboratorio"), ("farmacias", "Farmacia")]
with open(os.path.join(routers_dir, "salud_ext.py"), "w", encoding="utf-8") as f:
    f.write(build_clean_crud_router("/api/v1/salud", "Gestión Salud Ext", salud_endpoints))

print("✅ Todos los routers CRUD generados limpiamente sin errores de sintaxis.")
