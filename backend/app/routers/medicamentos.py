from app.db_helper import db_get_all, db_get_by_id, db_create, db_update, db_delete
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="/api/v1/medicamentos", tags=["Medicamentos"])

DB_STORE: Dict[str, Dict[int, Any]] = {}

@router.get("/drogas")
def list_drogas(db: Session = Depends(get_db)):
    return db_get_all(db, "drogas")

@router.get("/drogas/{item_id}")
def get_drogas(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "drogas", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Droga no encontrado")

@router.post("/drogas", status_code=201)
def create_drogas(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "drogas", data)

@router.put("/drogas/{item_id}")
def update_drogas(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "drogas", item_id, data)

@router.delete("/drogas/{item_id}")
def delete_drogas(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "drogas", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/monodrogas")
def list_monodrogas(db: Session = Depends(get_db)):
    return db_get_all(db, "monodrogas")

@router.get("/monodrogas/{item_id}")
def get_monodrogas(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "monodrogas", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Monodroga no encontrado")

@router.post("/monodrogas", status_code=201)
def create_monodrogas(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "monodrogas", data)

@router.put("/monodrogas/{item_id}")
def update_monodrogas(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "monodrogas", item_id, data)

@router.delete("/monodrogas/{item_id}")
def delete_monodrogas(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "monodrogas", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/potencias")
def list_potencias(db: Session = Depends(get_db)):
    return db_get_all(db, "potencias")

@router.get("/potencias/{item_id}")
def get_potencias(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "potencias", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Potencia no encontrado")

@router.post("/potencias", status_code=201)
def create_potencias(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "potencias", data)

@router.put("/potencias/{item_id}")
def update_potencias(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "potencias", item_id, data)

@router.delete("/potencias/{item_id}")
def delete_potencias(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "potencias", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/formas")
def list_formas(db: Session = Depends(get_db)):
    return db_get_all(db, "formas")

@router.get("/formas/{item_id}")
def get_formas(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "formas", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Forma Farmacéutica no encontrado")

@router.post("/formas", status_code=201)
def create_formas(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "formas", data)

@router.put("/formas/{item_id}")
def update_formas(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "formas", item_id, data)

@router.delete("/formas/{item_id}")
def delete_formas(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "formas", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/vias")
def list_vias(db: Session = Depends(get_db)):
    return db_get_all(db, "vias")

@router.get("/vias/{item_id}")
def get_vias(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "vias", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Vía Administración no encontrado")

@router.post("/vias", status_code=201)
def create_vias(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "vias", data)

@router.put("/vias/{item_id}")
def update_vias(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "vias", item_id, data)

@router.delete("/vias/{item_id}")
def delete_vias(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "vias", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/acciones")
def list_acciones(db: Session = Depends(get_db)):
    return db_get_all(db, "acciones")

@router.get("/acciones/{item_id}")
def get_acciones(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "acciones", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Acción Terapéutica no encontrado")

@router.post("/acciones", status_code=201)
def create_acciones(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "acciones", data)

@router.put("/acciones/{item_id}")
def update_acciones(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "acciones", item_id, data)

@router.delete("/acciones/{item_id}")
def delete_acciones(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "acciones", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/maestro")
def list_maestro(db: Session = Depends(get_db)):
    return db_get_all(db, "maestro")

@router.get("/maestro/{item_id}")
def get_maestro(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "maestro", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Maestro Medicamento no encontrado")

@router.post("/maestro", status_code=201)
def create_maestro(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "maestro", data)

@router.put("/maestro/{item_id}")
def update_maestro(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "maestro", item_id, data)

@router.delete("/maestro/{item_id}")
def delete_maestro(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "maestro", item_id)
    return {"status": "deleted", "id": item_id}
