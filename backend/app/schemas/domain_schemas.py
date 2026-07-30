from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class BaseORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# 1. Pais
class PaisCreate(BaseModel):
    nombre: str
    codigo_iso: str

class PaisUpdate(BaseModel):
    nombre: Optional[str] = None
    codigo_iso: Optional[str] = None
    activo: Optional[bool] = None

class PaisResponse(BaseORM):
    id: int
    nombre: str
    codigo_iso: str
    activo: bool

# 2. Provincia
class ProvinciaCreate(BaseModel):
    pais_id: int
    nombre: str

class ProvinciaUpdate(BaseModel):
    pais_id: Optional[int] = None
    nombre: Optional[str] = None
    activo: Optional[bool] = None

class ProvinciaResponse(BaseORM):
    id: int
    pais_id: int
    nombre: str
    activo: bool

# 3. Ubicacion
class UbicacionCreate(BaseModel):
    provincia_id: int
    localidad: str
    codigo_postal: str

class UbicacionUpdate(BaseModel):
    provincia_id: Optional[int] = None
    localidad: Optional[str] = None
    codigo_postal: Optional[str] = None
    activo: Optional[bool] = None

class UbicacionResponse(BaseORM):
    id: int
    provincia_id: int
    localidad: str
    codigo_postal: str
    activo: bool

# 4. Zona
class ZonaCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None

class ZonaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = None

class ZonaResponse(BaseORM):
    id: int
    nombre: str
    descripcion: Optional[str]
    activo: bool

# 5. Colegio Farmaceutico
class ColegioFarmaceuticoCreate(BaseModel):
    nombre: str
    cuit: str
    provincia_id: int

class ColegioFarmaceuticoUpdate(BaseModel):
    nombre: Optional[str] = None
    cuit: Optional[str] = None
    provincia_id: Optional[int] = None
    activo: Optional[bool] = None

class ColegioFarmaceuticoResponse(BaseORM):
    id: int
    nombre: str
    cuit: str
    provincia_id: int
    activo: bool

# 6. Categoria Medicamento
class CategoriaMedicamentoCreate(BaseModel):
    codigo: str
    descripcion: str

class CategoriaMedicamentoUpdate(BaseModel):
    codigo: Optional[str] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = None

class CategoriaMedicamentoResponse(BaseORM):
    id: int
    codigo: str
    descripcion: str
    activo: bool

# 7. Tipo Patologia
class TipoPatologiaCreate(BaseModel):
    nombre: str
    requiere_auditoria: bool = False

class TipoPatologiaUpdate(BaseModel):
    nombre: Optional[str] = None
    requiere_auditoria: Optional[bool] = None
    activo: Optional[bool] = None

class TipoPatologiaResponse(BaseORM):
    id: int
    nombre: str
    requiere_auditoria: bool
    activo: bool

# 8. Especialidad Medica
class EspecialidadMedicaCreate(BaseModel):
    nombre: str

class EspecialidadMedicaUpdate(BaseModel):
    nombre: Optional[str] = None
    activo: Optional[bool] = None

class EspecialidadMedicaResponse(BaseORM):
    id: int
    nombre: str
    activo: bool

# 9. Observacion
class ObservacionCreate(BaseModel):
    titulo: str
    detalle: str

class ObservacionUpdate(BaseModel):
    titulo: Optional[str] = None
    detalle: Optional[str] = None

class ObservacionResponse(BaseORM):
    id: int
    titulo: str
    detalle: str
    created_at: datetime

# 10. Vinculo
class VinculoCreate(BaseModel):
    parentesco: str

class VinculoUpdate(BaseModel):
    parentesco: Optional[str] = None
    activo: Optional[bool] = None

class VinculoResponse(BaseORM):
    id: int
    parentesco: str
    activo: bool

# 11. Periodo
class PeriodoCreate(BaseModel):
    codigo: str
    estado: str = "ABIERTO"
    fecha_inicio: date
    fecha_fin: date

class PeriodoUpdate(BaseModel):
    codigo: Optional[str] = None
    estado: Optional[str] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None

class PeriodoResponse(BaseORM):
    id: int
    codigo: str
    estado: str
    fecha_inicio: date
    fecha_fin: date

# 12. Drogueria
class DrogueriaCreate(BaseModel):
    razon_social: str
    cuit: str

class DrogueriaUpdate(BaseModel):
    razon_social: Optional[str] = None
    cuit: Optional[str] = None
    activo: Optional[bool] = None

class DrogueriaResponse(BaseORM):
    id: int
    razon_social: str
    cuit: str
    activo: bool