from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/v1/salud", tags=["Gestión Salud Extensiones"])

@router.get("/planes")
def get_planes(db: Session = Depends(get_db)):
    return [{"id": 1, "nombre": "Plan PMO Básico", "obraSocialId": 1, "activo": True}]

@router.get("/farmacias-os")
def get_farmacias_os(db: Session = Depends(get_db)):
    return [{"id": 1, "nombre": "Farmacia OS Central", "obraSocialId": 1, "activo": True}]

@router.get("/farmacias")
def get_farmacias(db: Session = Depends(get_db)):
    return [{"id": 1, "nombre": "Farmacia Del Pueblo", "cuit": "30-55555555-9", "activo": True}]
