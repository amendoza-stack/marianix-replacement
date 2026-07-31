from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/v1/exportaciones", tags=["Exportaciones"])

@router.get("/bonificaciones/excel")
def exportar_bonificaciones_excel(db: Session = Depends(get_db)):
    return {"status": "ok", "formato": "XLSX", "registros": 150, "downloadUrl": "/downloads/bonificaciones.xlsx"}

@router.get("/farmacias/layouts")
def exportar_farmacias_layouts(db: Session = Depends(get_db)):
    return {"status": "ok", "formato": "TXT/LAYOUT", "registros": 45, "downloadUrl": "/downloads/farmacias_layout.txt"}

@router.get("/bonificaciones/reporte")
def reporte_bonificaciones(db: Session = Depends(get_db)):
    return {"status": "ok", "reporte": "Reporte Consolidado Bonificaciones", "generado": True}
