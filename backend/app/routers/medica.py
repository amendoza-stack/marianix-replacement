from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/v1/medica", tags=["Gestión Médica"])

@router.get("/afiliados")
def get_afiliados(db: Session = Depends(get_db)):
    return [{"id": 1, "nombre": "Juan Pérez", "documento": "30111222", "activo": True}]

@router.get("/medicos")
def get_medicos(db: Session = Depends(get_db)):
    return [{"id": 1, "nombre": "Dr. Carlos Gómez", "matricula": "M-4512", "activo": True}]
