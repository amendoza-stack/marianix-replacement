from datetime import date
from typing import List, Optional
from sqlalchemy import String, Integer, Numeric, Boolean, ForeignKey, Index, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Laboratorio(Base):
    __tablename__ = "laboratorio"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    cuit: Mapped[str] = mapped_column(String(11), unique=True, nullable=False, index=True)
    razon_social: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    gln: Mapped[Optional[str]] = mapped_column(String(13), unique=True, nullable=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

class ObraSocial(Base):
    __tablename__ = "obra_social"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    codigo: Mapped[str] = mapped_column(String(10), unique=True, nullable=False, index=True)
    razon_social: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    cuit: Mapped[str] = mapped_column(String(11), unique=True, nullable=False, index=True)
    cbu: Mapped[Optional[str]] = mapped_column(String(22), nullable=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

    planes: Mapped[List["Plan"]] = relationship(back_populates="obra_social", cascade="all, delete-orphan")
    bonificaciones: Mapped[List["Bonificacion"]] = relationship(back_populates="obra_social")

class Plan(Base):
    __tablename__ = "plan"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    obra_social_id: Mapped[int] = mapped_column(ForeignKey("obra_social.id"), nullable=False)
    nombre: Mapped[str] = mapped_column(String(50), nullable=False)
    cobertura_porcentaje_defecto: Mapped[float] = mapped_column(Numeric(5, 2), default=40.0)
    requiere_vademecum: Mapped[bool] = mapped_column(Boolean, default=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

    obra_social: Mapped["ObraSocial"] = relationship(back_populates="planes")
    reglas_monodroga: Mapped[List["PlanMonodroga"]] = relationship(back_populates="plan", cascade="all, delete-orphan")

class PlanMonodroga(Base):
    __tablename__ = "plan_monodroga"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("plan.id"), nullable=False)
    monodroga_id: Mapped[int] = mapped_column(ForeignKey("monodroga.id"), nullable=False)
    porcentaje_cobertura: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    requiere_auditoria_previa: Mapped[bool] = mapped_column(Boolean, default=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

    plan: Mapped["Plan"] = relationship(back_populates="reglas_monodroga")

    __table_args__ = (
        Index("uix_plan_monodroga", "plan_id", "monodroga_id", unique=True),
    )

class Farmacia(Base):
    __tablename__ = "farmacia"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    codigo_cuit: Mapped[str] = mapped_column(String(11), unique=True, nullable=False, index=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    direccion: Mapped[str] = mapped_column(String(150), nullable=False)
    cbu_pago: Mapped[Optional[str]] = mapped_column(String(22), nullable=True)
    activa: Mapped[bool] = mapped_column(Boolean, default=True)

    bonificaciones: Mapped[List["Bonificacion"]] = relationship(back_populates="farmacia")

class Bonificacion(Base):
    __tablename__ = "bonificacion"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    obra_social_id: Mapped[int] = mapped_column(ForeignKey("obra_social.id"), nullable=False)
    farmacia_id: Mapped[int] = mapped_column(ForeignKey("farmacia.id"), nullable=False)
    porcentaje_bonificacion: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    fecha_vigencia_desde: Mapped[date] = mapped_column(nullable=False)
    fecha_vigencia_hasta: Mapped[Optional[date]] = mapped_column(nullable=True)
    activa: Mapped[bool] = mapped_column(Boolean, default=True)

    obra_social: Mapped["ObraSocial"] = relationship(back_populates="bonificaciones")
    farmacia: Mapped["Farmacia"] = relationship(back_populates="bonificaciones")