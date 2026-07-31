from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="/api/v1/medica", tags=["Gestión Médica"])

DB_STORE: Dict[str, Dict[int, Any]] = {}

DB_STORE["afiliados"] = {1: {"id": 1, "nombre": "Afiliado Ejemplo 1", "descripcion": "Afiliado Ejemplo 1", "activo": True}}

@router.get("/afiliados")
def list_afiliados(db: Session = Depends(get_db)):
    return list(DB_STORE["afiliados"].values())

@router.get("/afiliados/{item_id}")
def get_afiliados(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["afiliados"]:
        return DB_STORE["afiliados"][item_id]
    raise HTTPException(status_code=404, detail="Afiliado no encontrado")

@router.post("/afiliados", status_code=201)
def create_afiliados(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["afiliados"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["afiliados"][new_id] = record
    return record

@router.put("/afiliados/{item_id}")
def update_afiliados(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["afiliados"]:
        DB_STORE["afiliados"][item_id].update(data)
        return DB_STORE["afiliados"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["afiliados"][item_id] = record
    return record

@router.delete("/afiliados/{item_id}")
def delete_afiliados(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["afiliados"]:
        del DB_STORE["afiliados"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["medicos"] = {1: {"id": 1, "nombre": "Médico Ejemplo 1", "descripcion": "Médico Ejemplo 1", "activo": True}}

@router.get("/medicos")
def list_medicos(db: Session = Depends(get_db)):
    return list(DB_STORE["medicos"].values())

@router.get("/medicos/{item_id}")
def get_medicos(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["medicos"]:
        return DB_STORE["medicos"][item_id]
    raise HTTPException(status_code=404, detail="Médico no encontrado")

@router.post("/medicos", status_code=201)
def create_medicos(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["medicos"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["medicos"][new_id] = record
    return record

@router.put("/medicos/{item_id}")
def update_medicos(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["medicos"]:
        DB_STORE["medicos"][item_id].update(data)
        return DB_STORE["medicos"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["medicos"][item_id] = record
    return record

@router.delete("/medicos/{item_id}")
def delete_medicos(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["medicos"]:
        del DB_STORE["medicos"][item_id]
    return {"status": "deleted", "id": item_id}
