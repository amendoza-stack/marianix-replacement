import math
from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from pydantic import BaseModel
from sqlalchemy import Select, Tuple, func, or_, select
from sqlalchemy.orm import Session
from sqlalchemy.sql import ColumnElement

from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get_by_id(self, db: Session, id: Any) -> Optional[ModelType]:
        """Obtiene un registro por su Primary Key."""
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi_paginated(
        self,
        db: Session,
        *,
        page: int = 1,
        size: int = 20,
        search: Optional[str] = None,
        search_fields: Optional[List[str]] = None,
        order_by: str = "id",
        order_desc: bool = False,
        only_active: bool = True
    ) -> dict:
        """Consultas con filtrado, ordenamiento dinámico y paginación."""
        query: Select = select(self.model)

        # 1. Filtro de Borrado Lógico (si el modelo soporta 'activo' o 'activa')
        if only_active:
            if hasattr(self.model, "activo"):
                query = query.where(getattr(self.model, "activo") == True)
            elif hasattr(self.model, "activa"):
                query = query.where(getattr(self.model, "activa") == True)

        # 2. Búsqueda dinámicamente OR en campos de texto
        if search and search_fields:
            search_filters = []
            for field in search_fields:
                if hasattr(self.model, field):
                    column = getattr(self.model, field)
                    search_filters.append(column.ilike(f"%{search}%"))
            if search_filters:
                query = query.where(or_(*search_filters))

        # 3. Conteo total de registros
        total_count = db.scalar(select(func.count()).select_from(query.subquery())) or 0

        # 4. Ordenamiento
        if hasattr(self.model, order_by):
            col = getattr(self.model, order_by)
            query = query.order_by(col.desc() if order_desc else col.asc())

        # 5. Paginación OFFSET/LIMIT
        offset = (page - 1) * size
        items = db.scalars(query.offset(offset).limit(size)).all()

        total_pages = math.ceil(total_count / size) if total_count > 0 else 1

        return {
            "items": items,
            "total": total_count,
            "page": page,
            "size": size,
            "pages": total_pages
        }

    def create(self, db: Session, obj_in: CreateSchemaType) -> ModelType:
        """Crea un nuevo registro."""
        obj_data = obj_in.model_dump()
        db_obj = self.model(**obj_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        """Actualiza un registro existente (parcial o completo)."""
        obj_data = db_obj.__dict__
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)

        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: Any, soft_delete: bool = True) -> Optional[ModelType]:
        """Eliminación física o borrado lógico según disponibilidad del atributo 'activo'/'activa'."""
        db_obj = self.get_by_id(db, id)
        if not db_obj:
            return None

        # Borrado lógico preferente si la entidad lo implementa
        if soft_delete:
            if hasattr(db_obj, "activo"):
                setattr(db_obj, "activo", False)
                db.add(db_obj)
                db.commit()
                db.refresh(db_obj)
                return db_obj
            elif hasattr(db_obj, "activa"):
                setattr(db_obj, "activa", False)
                db.add(db_obj)
                db.commit()
                db.refresh(db_obj)
                return db_obj

        # Si no tiene flag de estado o se fuerza soft_delete=False -> Hard Delete
        db.delete(db_obj)
        db.commit()
        return db_obj