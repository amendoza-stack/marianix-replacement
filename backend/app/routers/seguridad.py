from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/v1/seguridad", tags=["Seguridad"])

@router.get("/usuarios")
def get_usuarios(db: Session = Depends(get_db)):
    return [{"id": 1, "username": "anamendoza", "email": "amendoza@farmakd.com", "activo": True}]

@router.get("/roles")
def get_roles(db: Session = Depends(get_db)):
    return [{"id": 1, "nombre": "Administrador", "descripcion": "Control Total"}, {"id": 2, "nombre": "Operador", "descripcion": "Operaciones Básicas"}]
