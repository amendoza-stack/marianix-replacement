from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/v1/medicamentos", tags=["Medicamentos"])

@router.get("/drogas")
def get_drogas(db: Session = Depends(get_db)): return [{"id": 1, "nombre": "Ibuprofeno"}]

@router.get("/monodrogas")
def get_monodrogas(db: Session = Depends(get_db)): return [{"id": 1, "nombre": "Paracetamol"}]

@router.get("/potencias")
def get_potencias(db: Session = Depends(get_db)): return [{"id": 1, "valor": "500 mg"}]

@router.get("/formas")
def get_formas(db: Session = Depends(get_db)): return [{"id": 1, "nombre": "Comprimidos"}]

@router.get("/vias")
def get_vias(db: Session = Depends(get_db)): return [{"id": 1, "nombre": "Oral"}]

@router.get("/acciones")
def get_acciones(db: Session = Depends(get_db)): return [{"id": 1, "nombre": "Analgésico"}]

@router.get("/maestro")
def get_maestro(db: Session = Depends(get_db)): return [{"id": 1, "gtin": "7791234567890", "nombreComercial": "Ibuevanol 400"}]
