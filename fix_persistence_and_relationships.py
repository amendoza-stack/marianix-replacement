import os
import json

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
app_dir = os.path.join(backend_dir, "app")
routers_dir = os.path.join(app_dir, "routers")
models_dir = os.path.join(app_dir, "models")
services_dir = os.path.join(app_dir, "services")
repositories_dir = os.path.join(app_dir, "repositories")

os.makedirs(models_dir, exist_ok=True)
os.makedirs(services_dir, exist_ok=True)
os.makedirs(repositories_dir, exist_ok=True)

# ==============================================================================
# FASE 5 & 6: MODELOS SQLALCHEMY Y FOREIGN KEYS (app/models/entities.py)
# ==============================================================================
entities_code = """from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
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
"""
with open(os.path.join(models_dir, "entities.py"), "w", encoding="utf-8") as f:
    f.write(entities_code)

# ==============================================================================
# FASE 5 & 8: REPOSITORIO BASE Y TRANSACCIONES CON COMMIT/ROLLBACK
# ==============================================================================
repo_base_code = """import logging
from sqlalchemy.orm import Session
from typing import TypeVar, Generic, Type, List, Optional

logger = logging.getLogger("marianix_repository")
T = TypeVar("T")

class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T], db: Session):
        self.model = model
        self.db = db

    def get_all(self, active_only: bool = True) -> List[T]:
        query = self.db.query(self.model)
        if active_only and hasattr(self.model, 'activo'):
            query = query.filter(self.model.activo == True)
        return query.all()

    def get_by_id(self, item_id: int) -> Optional[T]:
        return self.db.query(self.model).filter(self.model.id == item_id).first()

    def create(self, entity: T) -> T:
        try:
            self.db.add(entity)
            self.db.commit()
            self.db.refresh(entity)
            logger.info(f"✅ Transacción exitosa. Registro insertado: ID {getattr(entity, 'id', None)}")
            return entity
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Error en transacción CREATE. Rollback ejecutado: {str(e)}", exc_info=True)
            raise e

    def update(self, item_id: int, updates: dict) -> Optional[T]:
        try:
            entity = self.get_by_id(item_id)
            if not entity:
                return None
            for key, value in updates.items():
                if hasattr(entity, key) and value is not None:
                    setattr(entity, key, value)
            self.db.commit()
            self.db.refresh(entity)
            logger.info(f"✅ Transacción exitosa. Registro actualizado: ID {item_id}")
            return entity
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Error en transacción UPDATE ID {item_id}. Rollback ejecutado: {str(e)}", exc_info=True)
            raise e

    def delete_logic(self, item_id: int) -> bool:
        try:
            entity = self.get_by_id(item_id)
            if not entity:
                return False
            if hasattr(entity, 'activo'):
                entity.activo = False
            else:
                self.db.delete(entity)
            self.db.commit()
            logger.info(f"✅ Baja lógica confirmada en DB: ID {item_id}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Error en transacción DELETE ID {item_id}. Rollback ejecutado: {str(e)}", exc_info=True)
            raise e
"""
with open(os.path.join(repositories_dir, "base_repository.py"), "w", encoding="utf-8") as f:
    f.write(repo_base_code)

print("✅ REPOSITORIOS TRANSACCIONALES Y MODELOS CON RELACIONES CREADOS EXITOSAMENTE.")
