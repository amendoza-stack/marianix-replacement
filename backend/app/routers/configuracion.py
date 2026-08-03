from app.db_helper import db_get_all, db_get_by_id, db_create, db_update, db_delete
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="/api/v1/config", tags=["Configuración"])

DB_STORE: Dict[str, Dict[int, Any]] = {}

@router.get("/paises")
def list_paises(db: Session = Depends(get_db)):
    return db_get_all(db, "paises")

@router.get("/paises/{item_id}")
def get_paises(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "paises", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="País no encontrado")

@router.post("/paises", status_code=201)
def create_paises(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "paises", data)

@router.put("/paises/{item_id}")
def update_paises(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "paises", item_id, data)

@router.delete("/paises/{item_id}")
def delete_paises(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "paises", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/provincias")
def list_provincias(db: Session = Depends(get_db)):
    return db_get_all(db, "provincias")

@router.get("/provincias/{item_id}")
def get_provincias(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "provincias", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Provincia no encontrado")

@router.post("/provincias", status_code=201)
def create_provincias(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "provincias", data)

@router.put("/provincias/{item_id}")
def update_provincias(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "provincias", item_id, data)

@router.delete("/provincias/{item_id}")
def delete_provincias(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "provincias", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/ubicaciones")
def list_ubicaciones(db: Session = Depends(get_db)):
    return db_get_all(db, "ubicaciones")

@router.get("/ubicaciones/{item_id}")
def get_ubicaciones(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "ubicaciones", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Ubicación no encontrado")

@router.post("/ubicaciones", status_code=201)
def create_ubicaciones(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "ubicaciones", data)

@router.put("/ubicaciones/{item_id}")
def update_ubicaciones(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "ubicaciones", item_id, data)

@router.delete("/ubicaciones/{item_id}")
def delete_ubicaciones(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "ubicaciones", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/zonas")
def list_zonas(db: Session = Depends(get_db)):
    return db_get_all(db, "zonas")

@router.get("/zonas/{item_id}")
def get_zonas(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "zonas", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Zona no encontrado")

@router.post("/zonas", status_code=201)
def create_zonas(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "zonas", data)

@router.put("/zonas/{item_id}")
def update_zonas(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "zonas", item_id, data)

@router.delete("/zonas/{item_id}")
def delete_zonas(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "zonas", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/colegios-farmaceuticos")
def list_colegios_farmaceuticos(db: Session = Depends(get_db)):
    return db_get_all(db, "colegios-farmaceuticos")

@router.get("/colegios-farmaceuticos/{item_id}")
def get_colegios_farmaceuticos(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "colegios-farmaceuticos", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Colegio Farmacéutico no encontrado")

@router.post("/colegios-farmaceuticos", status_code=201)
def create_colegios_farmaceuticos(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "colegios-farmaceuticos", data)

@router.put("/colegios-farmaceuticos/{item_id}")
def update_colegios_farmaceuticos(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "colegios-farmaceuticos", item_id, data)

@router.delete("/colegios-farmaceuticos/{item_id}")
def delete_colegios_farmaceuticos(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "colegios-farmaceuticos", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/categorias-medicamentos")
def list_categorias_medicamentos(db: Session = Depends(get_db)):
    return db_get_all(db, "categorias-medicamentos")

@router.get("/categorias-medicamentos/{item_id}")
def get_categorias_medicamentos(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "categorias-medicamentos", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Categoría no encontrado")

@router.post("/categorias-medicamentos", status_code=201)
def create_categorias_medicamentos(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "categorias-medicamentos", data)

@router.put("/categorias-medicamentos/{item_id}")
def update_categorias_medicamentos(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "categorias-medicamentos", item_id, data)

@router.delete("/categorias-medicamentos/{item_id}")
def delete_categorias_medicamentos(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "categorias-medicamentos", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/tipos-patologias")
def list_tipos_patologias(db: Session = Depends(get_db)):
    return db_get_all(db, "tipos-patologias")

@router.get("/tipos-patologias/{item_id}")
def get_tipos_patologias(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "tipos-patologias", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Patología no encontrado")

@router.post("/tipos-patologias", status_code=201)
def create_tipos_patologias(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "tipos-patologias", data)

@router.put("/tipos-patologias/{item_id}")
def update_tipos_patologias(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "tipos-patologias", item_id, data)

@router.delete("/tipos-patologias/{item_id}")
def delete_tipos_patologias(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "tipos-patologias", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/especialidades-medicas")
def list_especialidades_medicas(db: Session = Depends(get_db)):
    return db_get_all(db, "especialidades-medicas")

@router.get("/especialidades-medicas/{item_id}")
def get_especialidades_medicas(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "especialidades-medicas", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Especialidad no encontrado")

@router.post("/especialidades-medicas", status_code=201)
def create_especialidades_medicas(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "especialidades-medicas", data)

@router.put("/especialidades-medicas/{item_id}")
def update_especialidades_medicas(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "especialidades-medicas", item_id, data)

@router.delete("/especialidades-medicas/{item_id}")
def delete_especialidades_medicas(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "especialidades-medicas", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/observaciones")
def list_observaciones(db: Session = Depends(get_db)):
    return db_get_all(db, "observaciones")

@router.get("/observaciones/{item_id}")
def get_observaciones(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "observaciones", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Observación no encontrado")

@router.post("/observaciones", status_code=201)
def create_observaciones(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "observaciones", data)

@router.put("/observaciones/{item_id}")
def update_observaciones(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "observaciones", item_id, data)

@router.delete("/observaciones/{item_id}")
def delete_observaciones(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "observaciones", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/vinculos")
def list_vinculos(db: Session = Depends(get_db)):
    return db_get_all(db, "vinculos")

@router.get("/vinculos/{item_id}")
def get_vinculos(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "vinculos", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Vínculo no encontrado")

@router.post("/vinculos", status_code=201)
def create_vinculos(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "vinculos", data)

@router.put("/vinculos/{item_id}")
def update_vinculos(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "vinculos", item_id, data)

@router.delete("/vinculos/{item_id}")
def delete_vinculos(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "vinculos", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/periodos")
def list_periodos(db: Session = Depends(get_db)):
    return db_get_all(db, "periodos")

@router.get("/periodos/{item_id}")
def get_periodos(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "periodos", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Período no encontrado")

@router.post("/periodos", status_code=201)
def create_periodos(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "periodos", data)

@router.put("/periodos/{item_id}")
def update_periodos(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "periodos", item_id, data)

@router.delete("/periodos/{item_id}")
def delete_periodos(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "periodos", item_id)
    return {"status": "deleted", "id": item_id}

@router.get("/droguerias")
def list_droguerias(db: Session = Depends(get_db)):
    return db_get_all(db, "droguerias")

@router.get("/droguerias/{item_id}")
def get_droguerias(item_id: int, db: Session = Depends(get_db)):
    res = db_get_by_id(db, "droguerias", item_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Droguería no encontrado")

@router.post("/droguerias", status_code=201)
def create_droguerias(data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_create(db, "droguerias", data)

@router.put("/droguerias/{item_id}")
def update_droguerias(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    return db_update(db, "droguerias", item_id, data)

@router.delete("/droguerias/{item_id}")
def delete_droguerias(item_id: int, db: Session = Depends(get_db)):
    db_delete(db, "droguerias", item_id)
    return {"status": "deleted", "id": item_id}
