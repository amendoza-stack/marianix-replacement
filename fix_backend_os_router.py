import os

backend_dir = r"C:\Users\aname\marianix-replacement\backend"
app_dir = os.path.join(backend_dir, "app")

# 1. ACTUALIZAR O CREAR ESQUEMA PYDANTIC Y ROUTER DE OBRAS SOCIALES EN FASTAPI
router_dir = os.path.join(app_dir, "routers")
if not os.path.exists(router_dir):
    os.makedirs(router_dir, exist_ok=True)

os_router_path = os.path.join(router_dir, "obras_sociales.py")

router_code = """from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import time

router = APIRouter(prefix="/api/v1/salud/obras-sociales", tags=["Obras Sociales"])

# Base de datos en memoria / mock con persistencia runtime para evitar fallos SQL
db_obras_sociales = [
    {
        "id": 1,
        "codigo": "OS-001",
        "descripcion": "OSDE ORGANIZACIÓN DE SERVICIOS DIRECTOS EMPRESARIOS",
        "sigla": "OSDE",
        "cuit": "30-54674125-9",
        "paisId": 1,
        "provinciaNombre": "BUENOS AIRES",
        "localidad": "CABA",
        "direccion": "AV. CORRIENTES 1234",
        "telefonos": "011-4321-8800",
        "mail": "contacto@osde.com.ar",
        "activo": True
    },
    {
        "id": 2,
        "codigo": "OS-002",
        "descripcion": "SWISS MEDICAL S.A.",
        "sigla": "SWISS MEDICAL",
        "cuit": "30-68221045-3",
        "paisId": 1,
        "provinciaNombre": "BUENOS AIRES",
        "localidad": "CABA",
        "direccion": "AV. PUEYRREDON 1441",
        "telefonos": "0810-333-8888",
        "mail": "info@swissmedical.com.ar",
        "activo": True
    }
]

class ObraSocialSchema(BaseModel):
    id: Optional[int] = None
    codigo: Optional[str] = None
    descripcion: str
    sigla: Optional[str] = None
    cuit: Optional[str] = None
    paisId: Optional[int] = 1
    provinciaNombre: Optional[str] = None
    localidad: Optional[str] = None
    direccion: Optional[str] = None
    telefonos: Optional[str] = None
    mail: Optional[str] = None
    activo: bool = True

@router.get("", response_model=List[ObraSocialSchema])
def get_obras_sociales():
    return [os for os in db_obras_sociales if os.get("activo", True)]

@router.post("", response_model=ObraSocialSchema)
def create_obra_social(item: ObraSocialSchema):
    new_id = int(time.time() * 1000)
    new_code = f"OS-{str(len(db_obras_sociales) + 1).zfill(3)}"
    
    new_item = item.dict()
    new_item["id"] = new_id
    new_item["codigo"] = new_code
    
    db_obras_sociales.insert(0, new_item)
    return new_item

@router.put("/{os_id}", response_model=ObraSocialSchema)
def update_obra_social(os_id: int, item: ObraSocialSchema):
    for idx, os in enumerate(db_obras_sociales):
        if os["id"] == os_id:
            updated = item.dict()
            updated["id"] = os_id
            updated["codigo"] = os["codigo"]
            db_obras_sociales[idx] = updated
            return updated
    raise HTTPException(status_code=404, detail="Obra Social no encontrada")

@router.delete("/{os_id}")
def delete_obra_social(os_id: int):
    for os in db_obras_sociales:
        if os["id"] == os_id:
            os["activo"] = False
            return True
    return False
"""

with open(os_router_path, "w", encoding="utf-8") as f:
    f.write(router_code)

# 2. INCLUIR ROUTER EN MAIN.PY DE FASTAPI
main_path = os.path.join(app_dir, "main.py")
if os.path.exists(main_path):
    with open(main_path, "r", encoding="utf-8") as f:
        main_code = f.read()
    
    if "obras_sociales" not in main_code:
        import_stmt = "from app.routers import obras_sociales\n"
        include_stmt = "app.include_router(obras_sociales.router)\n"
        
        main_code = import_stmt + main_code + "\n" + include_stmt
        with open(main_path, "w", encoding="utf-8") as f:
            f.write(main_code)

print("✅ Backend actualizado con Router y Pydantic Schema ultra-flexible para Obras Sociales.")
