from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, BigInteger, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Permiso(Base):
    __tablename__ = "permiso"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    codigo: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True) # Ej: 'RECETAS_CREATE'
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    descripcion: Mapped[Optional[str]] = mapped_column(String(255))

    roles: Mapped[List["RolPermiso"]] = relationship(back_populates="permiso", cascade="all, delete-orphan")

class Rol(Base):
    permisos_json = Column(Text, nullable=True)
    __tablename__ = "rol"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True) # Ej: 'ADMIN', 'OPERADOR'
    descripcion: Mapped[Optional[str]] = mapped_column(String(255))

    usuarios: Mapped[List["UsuarioRol"]] = relationship(back_populates="rol", cascade="all, delete-orphan")
    permisos: Mapped[List["RolPermiso"]] = relationship(back_populates="rol", cascade="all, delete-orphan")

class RolPermiso(Base):
    __tablename__ = "rol_permiso"

    rol_id: Mapped[int] = mapped_column(ForeignKey("rol.id", ondelete="CASCADE"), primary_key=True)
    permiso_id: Mapped[int] = mapped_column(ForeignKey("permiso.id", ondelete="CASCADE"), primary_key=True)

    rol: Mapped["Rol"] = relationship(back_populates="permisos")
    permiso: Mapped["Permiso"] = relationship(back_populates="roles")

class Usuario(Base):
    __tablename__ = "usuario"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    nombre_completo: Mapped[str] = mapped_column(String(100), nullable=False)
    
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    intentos_fallidos: Mapped[int] = mapped_column(Integer, default=0)
    bloqueado_hasta: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    reset_password_token: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    reset_token_expires: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    roles: Mapped[List["UsuarioRol"]] = relationship(back_populates="usuario", cascade="all, delete-orphan")

class UsuarioRol(Base):
    __tablename__ = "usuario_rol"

    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuario.id", ondelete="CASCADE"), primary_key=True)
    rol_id: Mapped[int] = mapped_column(ForeignKey("rol.id", ondelete="CASCADE"), primary_key=True)

    usuario: Mapped["Usuario"] = relationship(back_populates="roles")
    rol: Mapped["Rol"] = relationship(back_populates="usuarios")
