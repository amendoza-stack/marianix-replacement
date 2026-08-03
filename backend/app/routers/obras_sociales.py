from app.db_helper import db_get_all, db_get_by_id, db_create, db_update, db_delete
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import time

router = APIRouter(prefix="/api/v1/salud/obras-sociales", tags=["Obras Sociales"])

# Base de datos en memoria / mock con persistencia runtime para evitar fallos SQL

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
