import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db, SessionLocal
from app.models.domain_models import Receta
from app.models.gestion_medica_models import Afiliado, Medico
from app.models.salud_convenios_models import Farmacia
from app.services.report_storage_service import ReportStorageService
from app.services.report_generators import ReportGenerators

router = APIRouter(prefix="/reportes", tags=["Módulo de Reportes y Exportación"])

class ReporteRequest(BaseModel):
    formato: str # excel, pdf, csv, txt331
    periodo_id: Optional[int] = None
    farmacia_id: Optional[int] = None
    obra_social_id: Optional[int] = None

class ReporteSolicitadoResponse(BaseModel):
    mensaje: str
    token_descarga: str
    formato: str

def _generar_reporte_background(formato: str, periodo_id: Optional[int], farmacia_id: Optional[int], obra_social_id: Optional[int], file_path: str):
    db: Session = SessionLocal()
    try:
        query = db.query(Receta)
        if periodo_id:
            query = query.filter(Receta.periodo_id == periodo_id)
        if farmacia_id:
            query = query.filter(Receta.farmacia_id == farmacia_id)
        if obra_social_id:
            query = query.filter(Receta.obra_social_id == obra_social_id)

        recetas = query.all()
        data = []
        for r in recetas:
            farm = db.query(Farmacia).filter(Farmacia.id == r.farmacia_id).first()
            afi = db.query(Afiliado).filter(Afiliado.id == r.afiliado_id).first()
            med = db.query(Medico).filter(Medico.id == r.medico_id).first()

            data.append({
                "numero_receta": r.numero_receta,
                "fecha_dispensa": str(r.fecha_dispensa),
                "farmacia_nombre": farm.nombre if farm else "N/A",
                "farmacia_cuit": farm.codigo_cuit if farm else "00000000000",
                "afiliado_dni": afi.numero_documento if afi else "N/A",
                "medico_nombre": f"{med.apellido} {med.nombre}" if med else "N/A",
                "total_pvp": r.total_pvp,
                "total_cobertura_os": r.total_cobertura_os,
                "monto_bonificado": r.monto_bonificado
            })

        if formato == "excel":
            ReportGenerators.generate_excel_report(data, file_path)
        elif formato == "pdf":
            ReportGenerators.generate_pdf_report(data, file_path)
        elif formato == "csv":
            ReportGenerators.generate_csv_report(data, file_path)
        elif formato == "txt331":
            ReportGenerators.generate_reporte_331_txt(data, file_path)
    finally:
        db.close()

@router.post("/solicitar", response_model=ReporteSolicitadoResponse, status_code=status.HTTP_202_ACCEPTED)
def solicitar_reporte(req: ReporteRequest, background_tasks: BackgroundTasks):
    """Solicita la generación asíncrona de un reporte (Excel, PDF, CSV o TXT 331)."""
    fmt = req.formato.lower()
    if fmt not in ["excel", "pdf", "csv", "txt331"]:
        raise HTTPException(status_code=400, detail="Formato no soportado. Opciones válidas: excel, pdf, csv, txt331")

    ext_map = {"excel": ".xlsx", "pdf": ".pdf", "csv": ".csv", "txt331": ".txt"}
    filename = f"reporte_{fmt}_{uuid.uuid4().hex[:8]}{ext_map[fmt]}"
    file_path = os.path.join(ReportStorageService.STORAGE_DIR, filename)

    token = ReportStorageService.create_download_token(file_path, filename)

    # Disparar tarea en background
    background_tasks.add_task(
        _generar_reporte_background,
        formato=fmt,
        periodo_id=req.periodo_id,
        farmacia_id=req.farmacia_id,
        obra_social_id=req.obra_social_id,
        file_path=file_path
    )

    return ReporteSolicitadoResponse(
        mensaje="Su reporte se está generando en segundo plano.",
        token_descarga=token,
        formato=fmt
    )

@router.get("/descargar/{token}")
def descargar_reporte(token: str):
    """Descarga el archivo generado utilizando el token asignado."""
    info = ReportStorageService.get_file_info(token)
    if not info or not os.path.exists(info["file_path"]):
        raise HTTPException(status_code=404, detail="El reporte aún no se ha generado o el token ha expirado.")

    return FileResponse(
        path=info["file_path"],
        filename=info["filename"],
        media_type="application/octet-stream"
    )