from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Métricas"])

@router.get("/metrics")
def get_dashboard_metrics(
    periodo: str = Query(..., description="Período fiscal AAAAMM"),
    obra_social_id: Optional[int] = Query(None)
):
    return {
        "kpis": {
            "recetasProcesadas": 14250,
            "montoTotalProcesado": 18542090.50,
            "rechazosCount": 312,
            "tasaAprobacionPct": 97.8,
            "comparativaPeriodoAnteriorPct": 4.5
        },
        "charts": {
            "tendenciaMensual": {
                "meses": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
                "recetasValidadas": [11200, 12400, 13100, 12800, 14000, 13900, 14250],
                "recetasRechazadas": [450, 380, 410, 320, 290, 305, 312]
            },
            "distribucionObraSocial": {
                "labels": ["OSDE", "PAMI", "SWISS MEDICAL", "MEDIFÉ", "OTRAS"],
                "data": [35, 28, 18, 12, 7]
            }
        },
        "alertas": [
            {
                "id": 1,
                "tipo": "WARNING",
                "titulo": "Cierre de Período Próximo",
                "mensaje": "El período 202607 para la Obra Social PAMI liquida en 3 días.",
                "fechaLimite": "2026-07-31"
            },
            {
                "id": 2,
                "tipo": "INFO",
                "titulo": "Actualización del Vademécum 331",
                "mensaje": "Se incorporaron 140 nuevos principios activos para validación automática."
            }
        ]
    }
