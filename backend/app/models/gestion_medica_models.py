from datetime import date
from typing import List, Optional
from sqlalchemy import String, Integer, Numeric, Boolean, Date, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Droga(Base):
    __tablename__ = "droga"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    codigo: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

    monodrogas: Mapped[List["Monodroga"]] = relationship(back_populates="droga")

class Monodroga(Base):
    __tablename__ = "monodroga"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    droga_id: Mapped[Optional[int]] = mapped_column(ForeignKey("droga.id"), nullable=True)
    codigo: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    descripcion: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

    droga: Mapped[Optional["Droga"]] = relationship(back_populates="monodrogas")
    medicamentos: Mapped[List["Medicamento"]] = relationship(back_populates="monodroga")

class Medicamento(Base):
    __tablename__ = "medicamento"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    monodroga_id: Mapped[int] = mapped_column(ForeignKey("monodroga.id"), nullable=False)
    codigo_gtin: Mapped[str] = mapped_column(String(14), unique=True, nullable=False, index=True)
    nombre_comercial: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    presentacion: Mapped[str] = mapped_column(String(100), nullable=False)
    pvp_actual: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.0)
    requiere_receta: Mapped[bool] = mapped_column(Boolean, default=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

    monodroga: Mapped["Monodroga"] = relationship(back_populates="medicamentos")

class Medico(Base):
    __tablename__ = "medico"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    matricula_nacional: Mapped[Optional[str]] = mapped_column(String(20), unique=True, index=True, nullable=True)
    matricula_provincial: Mapped[Optional[str]] = mapped_column(String(20), unique=True, index=True, nullable=True)
    apellido: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    nombre: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    especialidad: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    numero_documento: Mapped[str] = mapped_column(String(15), unique=True, nullable=False, index=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

class Afiliado(Base):
    __tablename__ = "afiliado"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    obra_social_id: Mapped[int] = mapped_column(ForeignKey("obra_social.id"), nullable=False)
    plan_id: Mapped[int] = mapped_column(ForeignKey("plan.id"), nullable=False)
    numero_afiliado: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    numero_documento: Mapped[str] = mapped_column(String(15), nullable=False, index=True)
    apellido: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    nombre: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    fecha_nacimiento: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

    __table_args__ = (
        Index("uix_afiliado_os_num", "obra_social_id", "numero_afiliado", unique=True),
        Index("uix_afiliado_dni", "numero_documento", unique=True),
    )