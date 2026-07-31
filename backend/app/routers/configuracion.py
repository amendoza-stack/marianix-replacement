from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db

router = APIRouter(prefix="/api/v1/config", tags=["Configuración"])

def generic_mock_list(nombre: str):
    return [{"id": 1, "nombre": f"{nombre} Ejemplo 1", "activo": True}, {"id": 2, "nombre": f"{nombre} Ejemplo 2", "activo": True}]

@router.get("/paises")
def get_paises(db: Session = Depends(get_db)): return generic_mock_list("País")

@router.get("/provincias")
def get_provincias(db: Session = Depends(get_db)): return generic_mock_list("Provincia")

@router.get("/ubicaciones")
def get_ubicaciones(db: Session = Depends(get_db)): return generic_mock_list("Ubicación")

@router.get("/zonas")
def get_zonas(db: Session = Depends(get_db)): return generic_mock_list("Zona")

@router.get("/colegios-farmaceuticos")
def get_colegios(db: Session = Depends(get_db)): return generic_mock_list("Colegio Farmacéutico")

@router.get("/categorias-medicamentos")
def get_categorias(db: Session = Depends(get_db)): return generic_mock_list("Categoría")

@router.get("/tipos-patologias")
def get_patologias(db: Session = Depends(get_db)): return generic_mock_list("Patología")

@router.get("/especialidades-medicas")
def get_especialidades(db: Session = Depends(get_db)): return generic_mock_list("Especialidad")

@router.get("/observaciones")
def get_observaciones(db: Session = Depends(get_db)): return generic_mock_list("Observación")

@router.get("/vinculos")
def get_vinculos(db: Session = Depends(get_db)): return generic_mock_list("Vínculo")

@router.get("/periodos")
def get_periodos(db: Session = Depends(get_db)): return generic_mock_list("Período")

@router.get("/droguerias")
def get_droguerias(db: Session = Depends(get_db)): return generic_mock_list("Droguería")
