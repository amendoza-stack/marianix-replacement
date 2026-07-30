from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.receta_schemas import RecetaCreateRequest, RecetaResponse
from app.services.receta_service import RecetaService

router = APIRouter(prefix="/recetas", tags=["Núcleo Transaccional Recetas"])

@router.post("", response_model=RecetaResponse, status_code=status.HTTP_201_CREATED)
def ingresar_receta(req: RecetaCreateRequest, db: Session = Depends(get_db)):
    """
    Ingresa y procesa una Receta aplicando las validaciones RN-01 a RN-06:
    - Validación de Período Abierto (RN-01)
    - Verificación de Afiliado Activo (RN-02)
    - Verificación de Médico Activo (RN-03)
    - Control de Vigencia de Prescripción <= 30 días (RN-04)
    - Control de Duplicidad de Receta (RN-05)
    - Cálculo automático de Cobertura y Bonificación (RN-06)
    """
    nueva_receta = RecetaService.validate_and_create_receta(db, req)
    return nueva_receta