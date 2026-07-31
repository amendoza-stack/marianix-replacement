import logging
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
