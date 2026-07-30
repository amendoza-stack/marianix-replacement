from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

class BaseORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class RecetaDetalleInput(BaseModel):
    monodroga_id: int = Field(..., description="ID de la monodroga/medicamento prescrito")
    cantidad: int = Field(..., ge=1, description="Cantidad dispensada (mínimo 1)")
    pvp_unitario: float = Field(..., ge=0.0, description="Precio de Venta al Público unitario")

class RecetaCreateRequest(BaseModel):
    numero_receta: str = Field(..., description="Número único de la receta física/digital")
    obra_social_id: int
    farmacia_id: int
    afiliado_id: int
    medico_id: int
    fecha_prescripcion: date
    fecha_dispensa: date
    detalles: List[RecetaDetalleInput] = Field(..., min_length=1, description="Mínimo 1 renglón prescrito")

class RecetaDetalleResponse(BaseORM):
    id: int
    monodroga_id: int
    cantidad: int
    pvp_unitario: float
    porcentaje_cobertura: float
    monto_cobertura: float

class RecetaResponse(BaseORM):
    id: int
    numero_receta: str
    periodo_id: int
    obra_social_id: int
    farmacia_id: int
    afiliado_id: int
    medico_id: int
    fecha_prescripcion: date
    fecha_dispensa: date
    total_pvp: float
    total_cobertura_os: float
    porcentaje_bonificacion_aplicado: float
    monto_bonificado: float
    monto_a_cobrar_farmacia: float
    estado: str
    detalles: List[RecetaDetalleResponse]