from app.db_helper import db_get_all, db_get_by_id, db_create, db_update, db_delete
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="/api/v1/salud", tags=["Gestión Salud Ext"])

DB_STORE: Dict[str, Dict[int, Any]] = {}

@router.get("/obras-sociales")
def list_obras_sociales(db: Session = Depends(get_db)):
    return db_get_all(db, "obras-sociales")

@router.get("/obras-sociales/{item_id}")
def get_obras_sociales(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "obras-sociales", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Obra Social no encontrado")

@router.post("/obras-sociales", status_code=201)
def create_obras_sociales(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "obras-sociales", data)

@router.put("/obras-sociales/{item_id}")
def update_obras_sociales(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "obras-sociales", item_id, data)

@router.delete("/obras-sociales/{item_id}")
def delete_obras_sociales(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "obras-sociales", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/planes")
def list_planes(db: Session = Depends(get_db)):
    return db_get_all(db, "planes")

@router.get("/planes/{item_id}")
def get_planes(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "planes", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Plan no encontrado")

@router.post("/planes", status_code=201)
def create_planes(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "planes", data)

@router.put("/planes/{item_id}")
def update_planes(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "planes", item_id, data)

@router.delete("/planes/{item_id}")
def delete_planes(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "planes", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/farmacias-os")
def list_farmacias_os(db: Session = Depends(get_db)):
    return db_get_all(db, "farmacias-os")

@router.get("/farmacias-os/{item_id}")
def get_farmacias_os(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "farmacias-os", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Farmacia OS no encontrado")

@router.post("/farmacias-os", status_code=201)
def create_farmacias_os(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "farmacias-os", data)

@router.put("/farmacias-os/{item_id}")
def update_farmacias_os(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "farmacias-os", item_id, data)

@router.delete("/farmacias-os/{item_id}")
def delete_farmacias_os(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "farmacias-os", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/laboratorios")
def list_laboratorios(db: Session = Depends(get_db)):
    return db_get_all(db, "laboratorios")

@router.get("/laboratorios/{item_id}")
def get_laboratorios(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "laboratorios", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Laboratorio no encontrado")

@router.post("/laboratorios", status_code=201)
def create_laboratorios(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "laboratorios", data)

@router.put("/laboratorios/{item_id}")
def update_laboratorios(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "laboratorios", item_id, data)

@router.delete("/laboratorios/{item_id}")
def delete_laboratorios(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "laboratorios", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/farmacias")
def list_farmacias(db: Session = Depends(get_db)):
    return db_get_all(db, "farmacias")

@router.get("/farmacias/{item_id}")
def get_farmacias(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "farmacias", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Farmacia no encontrado")

@router.post("/farmacias", status_code=201)
def create_farmacias(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "farmacias", data)

@router.put("/farmacias/{item_id}")
def update_farmacias(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "farmacias", item_id, data)

@router.delete("/farmacias/{item_id}")
def delete_farmacias(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "farmacias", item_id)
    return {"status": "deleted", "id": item_id}
