from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/afiliados", tags=["Gestión de Afiliados"])

class AfiliadoSchema(BaseModel):
    id: Optional[int] = None
    numeroAfiliado: str
    nombreCompleto: str
    dni: str
    obraSocial: str
    plan: str
    activo: bool = True

AFILIADOS_DB = [
    {"id": 1, "numeroAfiliado": "AF-10023", "nombreCompleto": "Gómez María Laura", "dni": "32198421", "obraSocial": "PAMI", "plan": "Tradicional", "activo": True},
    {"id": 2, "numeroAfiliado": "AF-20941", "nombreCompleto": "Pérez Carlos Alberto", "dni": "28112399", "obraSocial": "OSDE", "plan": "210", "activo": True},
    {"id": 3, "numeroAfiliado": "AF-30412", "nombreCompleto": "Rodríguez Ana Clara", "dni": "35912401", "obraSocial": "SWISS MEDICAL", "plan": "310", "activo": False}
]

@router.get("", response_model=List[AfiliadoSchema])
def get_afiliados():
    return AFILIADOS_DB

@router.post("", response_model=AfiliadoSchema, status_code=status.HTTP_201_CREATED)
def create_afiliado(payload: AfiliadoSchema):
    new_id = max([a["id"] for a in AFILIADOS_DB], default=0) + 1
    new_item = payload.dict()
    new_item["id"] = new_id
    AFILIADOS_DB.append(new_item)
    return new_item

@router.put("/{afiliado_id}", response_model=AfiliadoSchema)
def update_afiliado(afiliado_id: int, payload: AfiliadoSchema):
    for idx, item in enumerate(AFILIADOS_DB):
        if item["id"] == afiliado_id:
            updated = payload.dict()
            updated["id"] = afiliado_id
            AFILIADOS_DB[idx] = updated
            return updated
    raise HTTPException(status_code=404, detail="Afiliado no encontrado")

@router.delete("/{afiliado_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_afiliado(afiliado_id: int):
    global AFILIADOS_DB
    AFILIADOS_DB = [a for a in AFILIADOS_DB if a["id"] != afiliado_id]
    return None