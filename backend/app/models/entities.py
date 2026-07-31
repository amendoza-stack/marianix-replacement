from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Pais(Base):
    __tablename__ = 'paises'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    codigo = Column(String(10), nullable=True)
    activo = Column(Boolean, default=True)

class Provincia(Base):
    __tablename__ = 'provincias'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    pais_id = Column(Integer, ForeignKey('paises.id', ondelete="RESTRICT"), nullable=False)
    activo = Column(Boolean, default=True)
    
    pais = relationship("Pais")

class ObraSocialModel(Base):
    __tablename__ = 'obras_sociales'
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50), unique=True, index=True, nullable=False)
    descripcion = Column(String(200), nullable=False)
    sigla = Column(String(50), nullable=True)
    cuit = Column(String(20), nullable=True)
    pais_id = Column(Integer, ForeignKey('paises.id'), nullable=True)
    provincia_nombre = Column(String(100), nullable=True)
    localidad = Column(String(100), nullable=True)
    direccion = Column(String(200), nullable=True)
    telefonos = Column(String(100), nullable=True)
    mail = Column(String(100), nullable=True)
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class LaboratorioModel(Base):
    __tablename__ = 'laboratorios'
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50), unique=True, index=True, nullable=False)
    descripcion = Column(String(200), nullable=False)
    cuit = Column(String(20), nullable=True)
    gln = Column(String(50), nullable=True)
    provincia_nombre = Column(String(100), nullable=True)
    localidad = Column(String(100), nullable=True)
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class MedicamentoModel(Base):
    __tablename__ = 'medicamentos'
    id = Column(Integer, primary_key=True, index=True)
    gtin = Column(String(50), unique=True, index=True, nullable=True)
    nombre_comercial = Column(String(200), nullable=False)
    presentacion = Column(String(100), nullable=True)
    laboratorio_id = Column(Integer, ForeignKey('laboratorios.id'), nullable=True)
    activo = Column(Boolean, default=True)
    
    laboratorio = relationship("LaboratorioModel")
