from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="/api/v1/seguridad", tags=["Seguridad"])

DB_STORE: Dict[str, Dict[int, Any]] = {}

DB_STORE["usuarios"] = {1: {"id": 1, "nombre": "Usuario Ejemplo 1", "descripcion": "Usuario Ejemplo 1", "activo": True}}

@router.get("/usuarios")
def list_usuarios(db: Session = Depends(get_db)):
    return list(DB_STORE["usuarios"].values())

@router.get("/usuarios/{item_id}")
def get_usuarios(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["usuarios"]:
        return DB_STORE["usuarios"][item_id]
    raise HTTPException(status_code=404, detail="Usuario no encontrado")

@router.post("/usuarios", status_code=201)
def create_usuarios(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["usuarios"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["usuarios"][new_id] = record
    return record

@router.put("/usuarios/{item_id}")
def update_usuarios(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["usuarios"]:
        DB_STORE["usuarios"][item_id].update(data)
        return DB_STORE["usuarios"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["usuarios"][item_id] = record
    return record

@router.delete("/usuarios/{item_id}")
def delete_usuarios(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["usuarios"]:
        del DB_STORE["usuarios"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["roles"] = {1: {"id": 1, "nombre": "Rol Ejemplo 1", "descripcion": "Rol Ejemplo 1", "activo": True}}

@router.get("/roles")
def list_roles(db: Session = Depends(get_db)):
    return list(DB_STORE["roles"].values())

@router.get("/roles/{item_id}")
def get_roles(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["roles"]:
        return DB_STORE["roles"][item_id]
    raise HTTPException(status_code=404, detail="Rol no encontrado")

@router.post("/roles", status_code=201)
def create_roles(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["roles"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["roles"][new_id] = record
    return record

@router.put("/roles/{item_id}")
def update_roles(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["roles"]:
        DB_STORE["roles"][item_id].update(data)
        return DB_STORE["roles"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["roles"][item_id] = record
    return record

@router.delete("/roles/{item_id}")
def delete_roles(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["roles"]:
        del DB_STORE["roles"][item_id]
    return {"status": "deleted", "id": item_id}
