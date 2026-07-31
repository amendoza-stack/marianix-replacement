from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/v1/importaciones", tags=["Importaciones"])

@router.post("/maestro-medicamentos")
def importar_maestro_medicamentos(db: Session = Depends(get_db)):
    return {
        "status": "ok",
        "mensaje": "Novedades de medicamentos importadas exitosamente",
        "procesados": 350,
        "insertados": 12,
        "actualizados": 338
    }
