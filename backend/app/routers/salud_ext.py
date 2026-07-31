from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="/api/v1/salud", tags=["Gestión Salud Ext"])

DB_STORE: Dict[str, Dict[int, Any]] = {}

DB_STORE["obras-sociales"] = {1: {"id": 1, "nombre": "Obra Social Ejemplo 1", "descripcion": "Obra Social Ejemplo 1", "activo": True}}

@router.get("/obras-sociales")
def list_obras_sociales(db: Session = Depends(get_db)):
    return list(DB_STORE["obras-sociales"].values())

@router.get("/obras-sociales/{item_id}")
def get_obras_sociales(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["obras-sociales"]:
        return DB_STORE["obras-sociales"][item_id]
    raise HTTPException(status_code=404, detail="Obra Social no encontrado")

@router.post("/obras-sociales", status_code=201)
def create_obras_sociales(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["obras-sociales"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["obras-sociales"][new_id] = record
    return record

@router.put("/obras-sociales/{item_id}")
def update_obras_sociales(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["obras-sociales"]:
        DB_STORE["obras-sociales"][item_id].update(data)
        return DB_STORE["obras-sociales"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["obras-sociales"][item_id] = record
    return record

@router.delete("/obras-sociales/{item_id}")
def delete_obras_sociales(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["obras-sociales"]:
        del DB_STORE["obras-sociales"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["planes"] = {1: {"id": 1, "nombre": "Plan Ejemplo 1", "descripcion": "Plan Ejemplo 1", "activo": True}}

@router.get("/planes")
def list_planes(db: Session = Depends(get_db)):
    return list(DB_STORE["planes"].values())

@router.get("/planes/{item_id}")
def get_planes(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["planes"]:
        return DB_STORE["planes"][item_id]
    raise HTTPException(status_code=404, detail="Plan no encontrado")

@router.post("/planes", status_code=201)
def create_planes(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["planes"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["planes"][new_id] = record
    return record

@router.put("/planes/{item_id}")
def update_planes(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["planes"]:
        DB_STORE["planes"][item_id].update(data)
        return DB_STORE["planes"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["planes"][item_id] = record
    return record

@router.delete("/planes/{item_id}")
def delete_planes(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["planes"]:
        del DB_STORE["planes"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["farmacias-os"] = {1: {"id": 1, "nombre": "Farmacia OS Ejemplo 1", "descripcion": "Farmacia OS Ejemplo 1", "activo": True}}

@router.get("/farmacias-os")
def list_farmacias_os(db: Session = Depends(get_db)):
    return list(DB_STORE["farmacias-os"].values())

@router.get("/farmacias-os/{item_id}")
def get_farmacias_os(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["farmacias-os"]:
        return DB_STORE["farmacias-os"][item_id]
    raise HTTPException(status_code=404, detail="Farmacia OS no encontrado")

@router.post("/farmacias-os", status_code=201)
def create_farmacias_os(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["farmacias-os"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["farmacias-os"][new_id] = record
    return record

@router.put("/farmacias-os/{item_id}")
def update_farmacias_os(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["farmacias-os"]:
        DB_STORE["farmacias-os"][item_id].update(data)
        return DB_STORE["farmacias-os"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["farmacias-os"][item_id] = record
    return record

@router.delete("/farmacias-os/{item_id}")
def delete_farmacias_os(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["farmacias-os"]:
        del DB_STORE["farmacias-os"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["laboratorios"] = {1: {"id": 1, "nombre": "Laboratorio Ejemplo 1", "descripcion": "Laboratorio Ejemplo 1", "activo": True}}

@router.get("/laboratorios")
def list_laboratorios(db: Session = Depends(get_db)):
    return list(DB_STORE["laboratorios"].values())

@router.get("/laboratorios/{item_id}")
def get_laboratorios(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["laboratorios"]:
        return DB_STORE["laboratorios"][item_id]
    raise HTTPException(status_code=404, detail="Laboratorio no encontrado")

@router.post("/laboratorios", status_code=201)
def create_laboratorios(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["laboratorios"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["laboratorios"][new_id] = record
    return record

@router.put("/laboratorios/{item_id}")
def update_laboratorios(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["laboratorios"]:
        DB_STORE["laboratorios"][item_id].update(data)
        return DB_STORE["laboratorios"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["laboratorios"][item_id] = record
    return record

@router.delete("/laboratorios/{item_id}")
def delete_laboratorios(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["laboratorios"]:
        del DB_STORE["laboratorios"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["farmacias"] = {1: {"id": 1, "nombre": "Farmacia Ejemplo 1", "descripcion": "Farmacia Ejemplo 1", "activo": True}}

@router.get("/farmacias")
def list_farmacias(db: Session = Depends(get_db)):
    return list(DB_STORE["farmacias"].values())

@router.get("/farmacias/{item_id}")
def get_farmacias(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["farmacias"]:
        return DB_STORE["farmacias"][item_id]
    raise HTTPException(status_code=404, detail="Farmacia no encontrado")

@router.post("/farmacias", status_code=201)
def create_farmacias(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["farmacias"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["farmacias"][new_id] = record
    return record

@router.put("/farmacias/{item_id}")
def update_farmacias(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["farmacias"]:
        DB_STORE["farmacias"][item_id].update(data)
        return DB_STORE["farmacias"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["farmacias"][item_id] = record
    return record

@router.delete("/farmacias/{item_id}")
def delete_farmacias(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["farmacias"]:
        del DB_STORE["farmacias"][item_id]
    return {"status": "deleted", "id": item_id}
