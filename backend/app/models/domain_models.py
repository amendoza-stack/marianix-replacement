from datetime import datetime, date, timezone
from typing import List, Optional
from sqlalchemy import String, Integer, Numeric, Boolean, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.gestion_medica_models import Monodroga, Medico, Afiliado
from app.models.salud_convenios_models import ObraSocial, Plan, Farmacia

class Pais(Base):
    __tablename__ = "pais"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    codigo_iso: Mapped[str] = mapped_column(String(3), unique=True, nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

class Provincia(Base):
    __tablename__ = "provincia"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pais_id: Mapped[int] = mapped_column(ForeignKey("pais.id"), nullable=False)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

class Ubicacion(Base):
    __tablename__ = "ubicacion"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    provincia_id: Mapped[int] = mapped_column(ForeignKey("provincia.id"), nullable=False)
    localidad: Mapped[str] = mapped_column(String(100), nullable=False)
    codigo_postal: Mapped[str] = mapped_column(String(10), nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

class Zona(Base):
    __tablename__ = "zona"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    descripcion: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

class ColegioFarmaceutico(Base):
    __tablename__ = "colegio_farmaceutico"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    cuit: Mapped[str] = mapped_column(String(11), unique=True, nullable=False)
    provincia_id: Mapped[int] = mapped_column(ForeignKey("provincia.id"), nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

class CategoriaMedicamento(Base):
    __tablename__ = "categoria_medicamento"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    codigo: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    descripcion: Mapped[str] = mapped_column(String(150), nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

class TipoPatologia(Base):
    __tablename__ = "tipo_patologia"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    requiere_auditoria: Mapped[bool] = mapped_column(Boolean, default=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

class EspecialidadMedica(Base):
    __tablename__ = "especialidad_medica"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

class Observacion(Base):
    __tablename__ = "observacion"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    titulo: Mapped[str] = mapped_column(String(100), nullable=False)
    detalle: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

class Vinculo(Base):
    __tablename__ = "vinculo"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    parentesco: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

class Periodo(Base):
    __tablename__ = "periodo"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    codigo: Mapped[str] = mapped_column(String(7), unique=True, nullable=False)
    estado: Mapped[str] = mapped_column(String(20), default="ABIERTO")
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[date] = mapped_column(Date, nullable=False)

class Drogueria(Base):
    __tablename__ = "drogueria"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    razon_social: Mapped[str] = mapped_column(String(150), nullable=False)
    cuit: Mapped[str] = mapped_column(String(11), unique=True, nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

class Receta(Base):
    __tablename__ = "receta"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    numero_receta: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    periodo_id: Mapped[int] = mapped_column(ForeignKey("periodo.id"), nullable=False)
    obra_social_id: Mapped[int] = mapped_column(ForeignKey("obra_social.id"), nullable=False)
    farmacia_id: Mapped[int] = mapped_column(ForeignKey("farmacia.id"), nullable=False)
    afiliado_id: Mapped[int] = mapped_column(ForeignKey("afiliado.id"), nullable=False)
    medico_id: Mapped[int] = mapped_column(ForeignKey("medico.id"), nullable=False)
    fecha_prescripcion: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_dispensa: Mapped[date] = mapped_column(Date, nullable=False)
    total_pvp: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0)
    total_cobertura_os: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0)
    porcentaje_bonificacion_aplicado: Mapped[float] = mapped_column(Numeric(5, 2), default=0.0)
    monto_bonificado: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0)
    monto_a_cobrar_farmacia: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0)
    estado: Mapped[str] = mapped_column(String(20), default="VALIDADA")
    detalles: Mapped[List["RecetaDetalle"]] = relationship(back_populates="receta", cascade="all, delete-orphan")

class RecetaDetalle(Base):
    __tablename__ = "receta_detalle"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    receta_id: Mapped[int] = mapped_column(ForeignKey("receta.id"), nullable=False)
    monodroga_id: Mapped[int] = mapped_column(ForeignKey("monodroga.id"), nullable=False)
    cantidad: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    pvp_unitario: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    porcentaje_cobertura: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    monto_cobertura: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    receta: Mapped["Receta"] = relationship(back_populates="detalles")

class AuditoriaLog(Base):
    __tablename__ = "auditoria_log"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    usuario_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    ip_origen: Mapped[str] = mapped_column(String(45), nullable=False)
    tabla_afectada: Mapped[str] = mapped_column(String(50), nullable=False)
    registro_id: Mapped[int] = mapped_column(Integer, nullable=False)
    operacion: Mapped[str] = mapped_column(String(10), nullable=False)
    valor_anterior: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    valor_nuevo: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))