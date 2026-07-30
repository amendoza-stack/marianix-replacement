from typing import Any, Dict, Generic, List, Optional, TypeVar, Union
from fastapi import HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.repositories.base_repository import BaseRepository

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, repository: BaseRepository[ModelType, CreateSchemaType, UpdateSchemaType]):
        self.repository = repository

    def get(self, db: Session, id: Any) -> ModelType:
        item = self.repository.get_by_id(db, id)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Registro con ID {id} no encontrado"
            )
        return item

    def get_paginated(
        self,
        db: Session,
        page: int = 1,
        size: int = 20,
        search: Optional[str] = None,
        search_fields: Optional[List[str]] = None,
        order_by: str = "id",
        order_desc: bool = False,
        only_active: bool = True
    ) -> dict:
        return self.repository.get_multi_paginated(
            db,
            page=page,
            size=size,
            search=search,
            search_fields=search_fields,
            order_by=order_by,
            order_desc=order_desc,
            only_active=only_active
        )

    def create(self, db: Session, obj_in: CreateSchemaType) -> ModelType:
        return self.repository.create(db, obj_in)

    def update(self, db: Session, id: Any, obj_in: UpdateSchemaType) -> ModelType:
        db_obj = self.get(db, id)
        return self.repository.update(db, db_obj=db_obj, obj_in=obj_in)

    def delete(self, db: Session, id: Any, soft_delete: bool = True) -> ModelType:
        db_obj = self.get(db, id)
        deleted_obj = self.repository.remove(db, id=id, soft_delete=soft_delete)
        return deleted_obj