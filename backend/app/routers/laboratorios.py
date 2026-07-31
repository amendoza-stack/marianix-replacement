import logging
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
import time

logger = logging.getLogger("marianix_laboratorios")
router = APIRouter(prefix="/api/v1/salud/laboratorios", tags=["Laboratorios"])

db_laboratorios = [
    {
        "id": 1,
        "codigo": "LAB-001",
        "descripcion": "LABORATORIOS ROEMMERS S.A.",
        "cuit": "30-50001000-4",
        "gln": "7790001000012",
        "provinciaNombre": "BUENOS AIRES",
        "localidad": "CABA",
        "activo": True
    },
    {
        "id": 2,
        "codigo": "LAB-002",
        "descripcion": "BAGÓ LABORATORIOS",
        "cuit": "30-50002000-8",
        "gln": "7790002000015",
        "provinciaNombre": "BUENOS AIRES",
        "localidad": "CABA",
        "activo": True
    }
]

class LaboratorioSchema(BaseModel):
    id: Optional[int] = None
    codigo: Optional[str] = None
    descripcion: str
    cuit: Optional[str] = None
    gln: Optional[str] = None
    provinciaNombre: Optional[str] = None
    localidad: Optional[str] = None
    activo: bool = True

@router.get("", response_model=List[LaboratorioSchema])
def get_laboratorios():
    return [l for l in db_laboratorios if l.get("activo", True)]

@router.post("", response_model=LaboratorioSchema, status_code=status.HTTP_201_CREATED)
def create_laboratorio(item: LaboratorioSchema):
    new_id = int(time.time() * 1000)
    new_code = f"LAB-{str(len(db_laboratorios) + 1).zfill(3)}"
    
    data = item.dict()
    data["id"] = new_id
    data["codigo"] = new_code
    
    db_laboratorios.insert(0, data)
    return data

@router.put("/{lab_id}", response_model=LaboratorioSchema)
def update_laboratorio(lab_id: int, item: LaboratorioSchema):
    for idx, l in enumerate(db_laboratorios):
        if l["id"] == lab_id:
            data = item.dict()
            data["id"] = lab_id
            data["codigo"] = l["codigo"]
            db_laboratorios[idx] = data
            return data
    raise HTTPException(status_code=404, detail="Laboratorio no encontrado")

@router.delete("/{lab_id}")
def delete_laboratorio(lab_id: int):
    for l in db_laboratorios:
        if l["id"] == lab_id:
            l["activo"] = False
            return True
    return False
