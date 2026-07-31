import os

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
app_dir = os.path.join(backend_dir, "app")
routers_dir = os.path.join(app_dir, "routers")

os.makedirs(routers_dir, exist_ok=True)

def generate_clean_router_file(tag_name: str, base_prefix: str, endpoints: list):
    code = f"""from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="{base_prefix}", tags=["{tag_name}"])

DB_STORE: Dict[str, Dict[int, Any]] = {{}}
"""
    for ep, name in endpoints:
        dict_key = ep if ep else "default"
        clean_ep = ep.replace('-', '_') if ep else "default"
        
        # Suffix para el decorador
        path_suffix = f"/{ep}" if ep else ""
        
        code += f"""
DB_STORE["{dict_key}"] = {{1: {{"id": 1, "nombre": "{name} Ejemplo 1", "descripcion": "{name} Ejemplo 1", "activo": True}}}}

@router.get("{path_suffix}")
def list_{clean_ep}(db: Session = Depends(get_db)):
    return list(DB_STORE["{dict_key}"].values())

@router.get("{path_suffix}/{{item_id}}")
def get_{clean_ep}(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["{dict_key}"]:
        return DB_STORE["{dict_key}"][item_id]
    raise HTTPException(status_code=404, detail="{name} no encontrado")

@router.post("{path_suffix}", status_code=201)
def create_{clean_ep}(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["{dict_key}"]) + 100
    record = {{"id": new_id, **data}}
    DB_STORE["{dict_key}"][new_id] = record
    return record

@router.put("{path_suffix}/{{item_id}}")
def update_{clean_ep}(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["{dict_key}"]:
        DB_STORE["{dict_key}"][item_id].update(data)
        return DB_STORE["{dict_key}"][item_id]
    record = {{"id": item_id, **data}}
    DB_STORE["{dict_key}"][item_id] = record
    return record

@router.delete("{path_suffix}/{{item_id}}")
def delete_{clean_ep}(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["{dict_key}"]:
        del DB_STORE["{dict_key}"][item_id]
    return {{"status": "deleted", "id": item_id}}
"""
    return code

# 1. Configuracion
cfg_eps = [
    ("paises", "País"), ("provincias", "Provincia"), ("ubicaciones", "Ubicación"),
    ("zonas", "Zona"), ("colegios-farmaceuticos", "Colegio Farmacéutico"),
    ("categorias-medicamentos", "Categoría"), ("tipos-patologias", "Patología"),
    ("especialidades-medicas", "Especialidad"), ("observaciones", "Observación"),
    ("vinculos", "Vínculo"), ("periodos", "Período"), ("droguerias", "Droguería")
]
with open(os.path.join(routers_dir, "configuracion.py"), "w", encoding="utf-8") as f:
    f.write(generate_clean_router_file("Configuración", "/api/v1/config", cfg_eps))

# 2. Seguridad
with open(os.path.join(routers_dir, "seguridad.py"), "w", encoding="utf-8") as f:
    f.write(generate_clean_router_file("Seguridad", "/api/v1/seguridad", [("usuarios", "Usuario"), ("roles", "Rol")]))

# 3. Medica
with open(os.path.join(routers_dir, "medica.py"), "w", encoding="utf-8") as f:
    f.write(generate_clean_router_file("Gestión Médica", "/api/v1/medica", [("afiliados", "Afiliado"), ("medicos", "Médico")]))

# 4. Salud
salud_eps = [("obras-sociales", "Obra Social"), ("planes", "Plan"), ("farmacias-os", "Farmacia OS"), ("laboratorios", "Laboratorio"), ("farmacias", "Farmacia")]
with open(os.path.join(routers_dir, "salud_ext.py"), "w", encoding="utf-8") as f:
    f.write(generate_clean_router_file("Gestión Salud Ext", "/api/v1/salud", salud_eps))

# 5. Medicamentos
meds_eps = [
    ("drogas", "Droga"), ("monodrogas", "Monodroga"), ("potencias", "Potencia"),
    ("formas", "Forma Farmacéutica"), ("vias", "Vía Administración"),
    ("acciones", "Acción Terapéutica"), ("maestro", "Maestro Medicamento")
]
with open(os.path.join(routers_dir, "medicamentos.py"), "w", encoding="utf-8") as f:
    f.write(generate_clean_router_file("Medicamentos", "/api/v1/medicamentos", meds_eps))

# 6. Bonificaciones
with open(os.path.join(routers_dir, "bonificaciones.py"), "w", encoding="utf-8") as f:
    f.write(generate_clean_router_file("Bonificaciones", "/api/v1/bonificaciones", [("", "Bonificación")]))

print("✅ Todos los archivos de routers han sido reconstruidos con sintaxis nativa limpia.")
