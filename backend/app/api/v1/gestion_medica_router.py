from fastapi import APIRouter

router = APIRouter(prefix="/gestion-medica", tags=["Gestión Médica"])

@router.get("/status")
def status():
    return {"status": "ok", "module": "gestion_medica"}
