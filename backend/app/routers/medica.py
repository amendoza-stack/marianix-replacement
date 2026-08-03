from app.db_helper import db_get_all, db_get_by_id, db_create, db_update, db_delete
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="/api/v1/medica", tags=["Gestión Médica"])

DB_STORE: Dict[str, Dict[int, Any]] = {}

@router.get("/afiliados")
def list_afiliados(db: Session = Depends(get_db)):
    return db_get_all(db, "afiliados")

@router.get("/afiliados/{item_id}")
def get_afiliados(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "afiliados", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Afiliado no encontrado")

@router.post("/afiliados", status_code=201)
def create_afiliados(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "afiliados", data)

@router.put("/afiliados/{item_id}")
def update_afiliados(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "afiliados", item_id, data)

@router.delete("/afiliados/{item_id}")
def delete_afiliados(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "afiliados", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/medicos")
def list_medicos(db: Session = Depends(get_db)):
    return db_get_all(db, "medicos")

@router.get("/medicos/{item_id}")
def get_medicos(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "medicos", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Médico no encontrado")

@router.post("/medicos", status_code=201)
def create_medicos(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "medicos", data)

@router.put("/medicos/{item_id}")
def update_medicos(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "medicos", item_id, data)

@router.delete("/medicos/{item_id}")
def delete_medicos(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "medicos", item_id)
    return {"status": "deleted", "id": item_id}
