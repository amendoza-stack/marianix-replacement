from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="/api/v1/bonificaciones", tags=["Bonificaciones"])

DB_STORE: Dict[str, Dict[int, Any]] = {}

DB_STORE["default"] = {1: {"id": 1, "nombre": "Bonificación Ejemplo 1", "descripcion": "Bonificación Ejemplo 1", "activo": True}}

@router.get("")
def list_default(db: Session = Depends(get_db)):
    return list(DB_STORE["default"].values())

@router.get("/{item_id}")
def get_default(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["default"]:
        return DB_STORE["default"][item_id]
    raise HTTPException(status_code=404, detail="Bonificación no encontrado")

@router.post("", status_code=201)
def create_default(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["default"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["default"][new_id] = record
    return record

@router.put("/{item_id}")
def update_default(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["default"]:
        DB_STORE["default"][item_id].update(data)
        return DB_STORE["default"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["default"][item_id] = record
    return record

@router.delete("/{item_id}")
def delete_default(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["default"]:
        del DB_STORE["default"][item_id]
    return {"status": "deleted", "id": item_id}
