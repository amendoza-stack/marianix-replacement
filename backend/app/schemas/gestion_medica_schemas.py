from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator, model_validator

class BaseORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# --- AFILIADO SCHEMAS ---
class AfiliadoCreate(BaseModel):
    obra_social_id: int
    plan_id: int
    numero_afiliado: str
    numero_documento: str
    apellido: str
    nombre: str
    fecha_nacimiento: Optional[date] = None

    @field_validator("numero_documento")
    @classmethod
    def validate_dni(cls, v: str) -> str:
        clean = v.strip().replace(".", "").replace("-", "")
        if not clean.isdigit() or not (7 <= len(clean) <= 8):
            raise ValueError("El DNI debe contener entre 7 y 8 dígitos numéricos.")
        return clean

class AfiliadoUpdate(BaseModel):
    obra_social_id: Optional[int] = None
    plan_id: Optional[int] = None
    numero_afiliado: Optional[str] = None
    numero_documento: Optional[str] = None
    apellido: Optional[str] = None
    nombre: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    activo: Optional[bool] = None

class AfiliadoResponse(BaseORM):
    id: int
    obra_social_id: int
    plan_id: int
    numero_afiliado: str
    numero_documento: str
    apellido: str
    nombre: str
    fecha_nacimiento: Optional[date]
    activo: bool

# --- MEDICO SCHEMAS ---
class MedicoCreate(BaseModel):
    matricula_nacional: Optional[str] = None
    matricula_provincial: Optional[str] = None
    apellido: str
    nombre: str
    especialidad: str
    numero_documento: str

    @field_validator("numero_documento")
    @classmethod
    def validate_dni(cls, v: str) -> str:
        clean = v.strip().replace(".", "").replace("-", "")
        if not clean.isdigit() or not (7 <= len(clean) <= 8):
            raise ValueError("El DNI del médico debe ser numérico de 7 a 8 dígitos.")
        return clean

    @model_validator(mode="after")
    def validate_matricula(self):
        if not self.matricula_nacional and not self.matricula_provincial:
            raise ValueError("Debe ingresar al menos la Matrícula Nacional o la Provincial.")
        return self

class MedicoUpdate(BaseModel):
    matricula_nacional: Optional[str] = None
    matricula_provincial: Optional[str] = None
    apellido: Optional[str] = None
    nombre: Optional[str] = None
    especialidad: Optional[str] = None
    numero_documento: Optional[str] = None
    activo: Optional[bool] = None

class MedicoResponse(BaseORM):
    id: int
    matricula_nacional: Optional[str]
    matricula_provincial: Optional[str]
    apellido: str
    nombre: str
    especialidad: str
    numero_documento: str
    activo: bool

# --- DROGA SCHEMAS ---
class DrogaCreate(BaseModel):
    codigo: str
    nombre: str

class DrogaUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    activo: Optional[bool] = None

class DrogaResponse(BaseORM):
    id: int
    codigo: str
    nombre: str
    activo: bool

# --- MONODROGA SCHEMAS ---
class MonodrogaCreate(BaseModel):
    droga_id: Optional[int] = None
    codigo: str
    descripcion: str

class MonodrogaUpdate(BaseModel):
    droga_id: Optional[int] = None
    codigo: Optional[str] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = None

class MonodrogaResponse(BaseORM):
    id: int
    droga_id: Optional[int]
    codigo: str
    descripcion: str
    activo: bool

# --- MEDICAMENTO SCHEMAS ---
class MedicamentoCreate(BaseModel):
    monodroga_id: int
    codigo_gtin: str
    nombre_comercial: str
    presentacion: str
    pvp_actual: float
    requiere_receta: bool = True

class MedicamentoUpdate(BaseModel):
    monodroga_id: Optional[int] = None
    codigo_gtin: Optional[str] = None
    nombre_comercial: Optional[str] = None
    presentacion: Optional[str] = None
    pvp_actual: Optional[float] = None
    requiere_receta: Optional[bool] = None
    activo: Optional[bool] = None

class MedicamentoResponse(BaseORM):
    id: int
    monodroga_id: int
    codigo_gtin: str
    nombre_comercial: str
    presentacion: str
    pvp_actual: float
    requiere_receta: bool
    activo: bool

# --- AUTOCOMPLETE SCHEMA ---
class AutocompleteResponse(BaseModel):
    id: int
    label: str
    extra_info: Optional[str] = None