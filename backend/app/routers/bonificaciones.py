from app.db_helper import db_get_all, db_get_by_id, db_create, db_update, db_delete
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="/api/v1/bonificaciones", tags=["Bonificaciones"])

DB_STORE: Dict[str, Dict[int, Any]] = {}

@router.get("")
def list_default(db: Session = Depends(get_db)):
    return db_get_all(db, "default")

@router.get("/{item_id}")
def get_default(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "default", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Bonificación no encontrado")

@router.post("", status_code=201)
def create_default(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "default", data)

@router.put("/{item_id}")
def update_default(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "default", item_id, data)

@router.delete("/{item_id}")
def delete_default(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "default", item_id)
    return {"status": "deleted", "id": item_id}
