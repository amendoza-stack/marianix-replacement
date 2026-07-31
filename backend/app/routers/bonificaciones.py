from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/v1/bonificaciones", tags=["Bonificaciones"])

@router.get("")
def get_bonificaciones(db: Session = Depends(get_db)):
    return [{"id": 1, "descripcion": "Bonificación Especial 10%", "porcentaje": 10.0}]
