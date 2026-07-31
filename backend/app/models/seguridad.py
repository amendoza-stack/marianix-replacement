from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

rol_permisos = Table(
    'rol_permisos',
    Base.metadata,
    Column('rol_id', Integer, ForeignKey('roles.id', ondelete="CASCADE"), primary_key=True),
    Column('permiso_id', Integer, ForeignKey('permisos.id', ondelete="CASCADE"), primary_key=True)
)

class Permiso(Base):
    __tablename__ = 'permisos'

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(150), unique=True, nullable=False, index=True)
    nombre = Column(String(150), nullable=False)
    modulo = Column(String(100), nullable=False, index=True)
    accion = Column(String(50), nullable=False, index=True)
    descripcion = Column(String(255), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    roles = relationship("Rol", secondary=rol_permisos, back_populates="permisos")

class Rol(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False)
    descripcion = Column(String(255), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)

    permisos = relationship("Permiso", secondary=rol_permisos, back_populates="roles")
