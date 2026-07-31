from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="/api/v1/medicamentos", tags=["Medicamentos"])

DB_STORE: Dict[str, Dict[int, Any]] = {}

DB_STORE["drogas"] = {1: {"id": 1, "nombre": "Droga Ejemplo 1", "descripcion": "Droga Ejemplo 1", "activo": True}}

@router.get("/drogas")
def list_drogas(db: Session = Depends(get_db)):
    return list(DB_STORE["drogas"].values())

@router.get("/drogas/{item_id}")
def get_drogas(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["drogas"]:
        return DB_STORE["drogas"][item_id]
    raise HTTPException(status_code=404, detail="Droga no encontrado")

@router.post("/drogas", status_code=201)
def create_drogas(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["drogas"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["drogas"][new_id] = record
    return record

@router.put("/drogas/{item_id}")
def update_drogas(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["drogas"]:
        DB_STORE["drogas"][item_id].update(data)
        return DB_STORE["drogas"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["drogas"][item_id] = record
    return record

@router.delete("/drogas/{item_id}")
def delete_drogas(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["drogas"]:
        del DB_STORE["drogas"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["monodrogas"] = {1: {"id": 1, "nombre": "Monodroga Ejemplo 1", "descripcion": "Monodroga Ejemplo 1", "activo": True}}

@router.get("/monodrogas")
def list_monodrogas(db: Session = Depends(get_db)):
    return list(DB_STORE["monodrogas"].values())

@router.get("/monodrogas/{item_id}")
def get_monodrogas(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["monodrogas"]:
        return DB_STORE["monodrogas"][item_id]
    raise HTTPException(status_code=404, detail="Monodroga no encontrado")

@router.post("/monodrogas", status_code=201)
def create_monodrogas(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["monodrogas"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["monodrogas"][new_id] = record
    return record

@router.put("/monodrogas/{item_id}")
def update_monodrogas(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["monodrogas"]:
        DB_STORE["monodrogas"][item_id].update(data)
        return DB_STORE["monodrogas"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["monodrogas"][item_id] = record
    return record

@router.delete("/monodrogas/{item_id}")
def delete_monodrogas(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["monodrogas"]:
        del DB_STORE["monodrogas"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["potencias"] = {1: {"id": 1, "nombre": "Potencia Ejemplo 1", "descripcion": "Potencia Ejemplo 1", "activo": True}}

@router.get("/potencias")
def list_potencias(db: Session = Depends(get_db)):
    return list(DB_STORE["potencias"].values())

@router.get("/potencias/{item_id}")
def get_potencias(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["potencias"]:
        return DB_STORE["potencias"][item_id]
    raise HTTPException(status_code=404, detail="Potencia no encontrado")

@router.post("/potencias", status_code=201)
def create_potencias(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["potencias"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["potencias"][new_id] = record
    return record

@router.put("/potencias/{item_id}")
def update_potencias(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["potencias"]:
        DB_STORE["potencias"][item_id].update(data)
        return DB_STORE["potencias"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["potencias"][item_id] = record
    return record

@router.delete("/potencias/{item_id}")
def delete_potencias(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["potencias"]:
        del DB_STORE["potencias"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["formas"] = {1: {"id": 1, "nombre": "Forma Farmacéutica Ejemplo 1", "descripcion": "Forma Farmacéutica Ejemplo 1", "activo": True}}

@router.get("/formas")
def list_formas(db: Session = Depends(get_db)):
    return list(DB_STORE["formas"].values())

@router.get("/formas/{item_id}")
def get_formas(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["formas"]:
        return DB_STORE["formas"][item_id]
    raise HTTPException(status_code=404, detail="Forma Farmacéutica no encontrado")

@router.post("/formas", status_code=201)
def create_formas(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["formas"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["formas"][new_id] = record
    return record

@router.put("/formas/{item_id}")
def update_formas(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["formas"]:
        DB_STORE["formas"][item_id].update(data)
        return DB_STORE["formas"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["formas"][item_id] = record
    return record

@router.delete("/formas/{item_id}")
def delete_formas(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["formas"]:
        del DB_STORE["formas"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["vias"] = {1: {"id": 1, "nombre": "Vía Administración Ejemplo 1", "descripcion": "Vía Administración Ejemplo 1", "activo": True}}

@router.get("/vias")
def list_vias(db: Session = Depends(get_db)):
    return list(DB_STORE["vias"].values())

@router.get("/vias/{item_id}")
def get_vias(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["vias"]:
        return DB_STORE["vias"][item_id]
    raise HTTPException(status_code=404, detail="Vía Administración no encontrado")

@router.post("/vias", status_code=201)
def create_vias(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["vias"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["vias"][new_id] = record
    return record

@router.put("/vias/{item_id}")
def update_vias(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["vias"]:
        DB_STORE["vias"][item_id].update(data)
        return DB_STORE["vias"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["vias"][item_id] = record
    return record

@router.delete("/vias/{item_id}")
def delete_vias(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["vias"]:
        del DB_STORE["vias"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["acciones"] = {1: {"id": 1, "nombre": "Acción Terapéutica Ejemplo 1", "descripcion": "Acción Terapéutica Ejemplo 1", "activo": True}}

@router.get("/acciones")
def list_acciones(db: Session = Depends(get_db)):
    return list(DB_STORE["acciones"].values())

@router.get("/acciones/{item_id}")
def get_acciones(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["acciones"]:
        return DB_STORE["acciones"][item_id]
    raise HTTPException(status_code=404, detail="Acción Terapéutica no encontrado")

@router.post("/acciones", status_code=201)
def create_acciones(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["acciones"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["acciones"][new_id] = record
    return record

@router.put("/acciones/{item_id}")
def update_acciones(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["acciones"]:
        DB_STORE["acciones"][item_id].update(data)
        return DB_STORE["acciones"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["acciones"][item_id] = record
    return record

@router.delete("/acciones/{item_id}")
def delete_acciones(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["acciones"]:
        del DB_STORE["acciones"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["maestro"] = {1: {"id": 1, "nombre": "Maestro Medicamento Ejemplo 1", "descripcion": "Maestro Medicamento Ejemplo 1", "activo": True}}

@router.get("/maestro")
def list_maestro(db: Session = Depends(get_db)):
    return list(DB_STORE["maestro"].values())

@router.get("/maestro/{item_id}")
def get_maestro(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["maestro"]:
        return DB_STORE["maestro"][item_id]
    raise HTTPException(status_code=404, detail="Maestro Medicamento no encontrado")

@router.post("/maestro", status_code=201)
def create_maestro(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["maestro"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["maestro"][new_id] = record
    return record

@router.put("/maestro/{item_id}")
def update_maestro(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["maestro"]:
        DB_STORE["maestro"][item_id].update(data)
        return DB_STORE["maestro"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["maestro"][item_id] = record
    return record

@router.delete("/maestro/{item_id}")
def delete_maestro(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["maestro"]:
        del DB_STORE["maestro"][item_id]
    return {"status": "deleted", "id": item_id}
