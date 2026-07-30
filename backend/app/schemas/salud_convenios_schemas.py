from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator

class BaseORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)

def validate_cuit_format(v: str) -> str:
    clean = v.strip().replace("-", "").replace(".", "")
    if not clean.isdigit() or len(clean) != 11:
        raise ValueError("El CUIT debe contener exactamente 11 dígitos numéricos.")
    return clean

def validate_cbu_format(v: Optional[str]) -> Optional[str]:
    if not v:
        return None
    clean = v.strip().replace(" ", "")
    if not clean.isdigit() or len(clean) != 22:
        raise ValueError("El CBU debe contener exactamente 22 dígitos numéricos.")
    return clean

# --- LABORATORIO ---
class LaboratorioCreate(BaseModel):
    cuit: str
    razon_social: str
    gln: Optional[str] = None

    @field_validator("cuit")
    @classmethod
    def check_cuit(cls, v: str) -> str:
        return validate_cuit_format(v)

class LaboratorioUpdate(BaseModel):
    cuit: Optional[str] = None
    razon_social: Optional[str] = None
    gln: Optional[str] = None
    activo: Optional[bool] = None

class LaboratorioResponse(BaseORM):
    id: int
    cuit: str
    razon_social: str
    gln: Optional[str]
    activo: bool

# --- OBRA SOCIAL ---
class ObraSocialCreate(BaseModel):
    codigo: str
    razon_social: str
    cuit: str
    cbu: Optional[str] = None

    @field_validator("cuit")
    @classmethod
    def check_cuit(cls, v: str) -> str:
        return validate_cuit_format(v)

    @field_validator("cbu")
    @classmethod
    def check_cbu(cls, v: Optional[str]) -> Optional[str]:
        return validate_cbu_format(v)

class ObraSocialUpdate(BaseModel):
    codigo: Optional[str] = None
    razon_social: Optional[str] = None
    cuit: Optional[str] = None
    cbu: Optional[str] = None
    activo: Optional[bool] = None

class ObraSocialResponse(BaseORM):
    id: int
    codigo: str
    razon_social: str
    cuit: str
    cbu: Optional[str]
    activo: bool

# --- PLAN ---
class PlanCreate(BaseModel):
    obra_social_id: int
    nombre: str
    cobertura_porcentaje_defecto: float = 40.0
    requiere_vademecum: bool = False

class PlanUpdate(BaseModel):
    obra_social_id: Optional[int] = None
    nombre: Optional[str] = None
    cobertura_porcentaje_defecto: Optional[float] = None
    requiere_vademecum: Optional[float] = None
    activo: Optional[bool] = None

class PlanResponse(BaseORM):
    id: int
    obra_social_id: int
    nombre: str
    cobertura_porcentaje_defecto: float
    requiere_vademecum: bool
    activo: bool

# --- PLAN MONODROGA ---
class PlanMonodrogaCreate(BaseModel):
    plan_id: int
    monodroga_id: int
    porcentaje_cobertura: float
    requiere_auditoria_previa: bool = False

class PlanMonodrogaUpdate(BaseModel):
    porcentaje_cobertura: Optional[float] = None
    requiere_auditoria_previa: Optional[bool] = None
    activo: Optional[bool] = None

class PlanMonodrogaResponse(BaseORM):
    id: int
    plan_id: int
    monodroga_id: int
    porcentaje_cobertura: float
    requiere_auditoria_previa: bool
    activo: bool

# --- FARMACIA ---
class FarmaciaCreate(BaseModel):
    codigo_cuit: str
    nombre: str
    direccion: str
    cbu_pago: Optional[str] = None

    @field_validator("codigo_cuit")
    @classmethod
    def check_cuit(cls, v: str) -> str:
        return validate_cuit_format(v)

    @field_validator("cbu_pago")
    @classmethod
    def check_cbu(cls, v: Optional[str]) -> Optional[str]:
        return validate_cbu_format(v)

class FarmaciaUpdate(BaseModel):
    codigo_cuit: Optional[str] = None
    nombre: Optional[str] = None
    direccion: Optional[str] = None
    cbu_pago: Optional[str] = None
    activa: Optional[bool] = None

class FarmaciaResponse(BaseORM):
    id: int
    codigo_cuit: str
    nombre: str
    direccion: str
    cbu_pago: Optional[str]
    activa: bool

# --- BONIFICACION & CÁLCULO ---
class BonificacionCreate(BaseModel):
    obra_social_id: int
    farmacia_id: int
    porcentaje_bonificacion: float
    fecha_vigencia_desde: date
    fecha_vigencia_hasta: Optional[date] = None

class BonificacionUpdate(BaseModel):
    porcentaje_bonificacion: Optional[float] = None
    fecha_vigencia_desde: Optional[date] = None
    fecha_vigencia_hasta: Optional[date] = None
    activa: Optional[bool] = None

class BonificacionResponse(BaseORM):
    id: int
    obra_social_id: int
    farmacia_id: int
    porcentaje_bonificacion: float
    fecha_vigencia_desde: date
    fecha_vigencia_hasta: Optional[date]
    activa: bool

class CalculoBonificacionRequest(BaseModel):
    pvp_total: float
    porcentaje_bonificacion: float

class CalculoBonificacionResponse(BaseModel):
    pvp_total: float
    porcentaje_bonificacion: float
    monto_bonificado: float
    monto_a_cobrar_farmacia: float