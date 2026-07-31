from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="/api/v1/config", tags=["Configuración"])

DB_STORE: Dict[str, Dict[int, Any]] = {}

DB_STORE["paises"] = {1: {"id": 1, "nombre": "País Ejemplo 1", "descripcion": "País Ejemplo 1", "activo": True}}

@router.get("/paises")
def list_paises(db: Session = Depends(get_db)):
    return list(DB_STORE["paises"].values())

@router.get("/paises/{item_id}")
def get_paises(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["paises"]:
        return DB_STORE["paises"][item_id]
    raise HTTPException(status_code=404, detail="País no encontrado")

@router.post("/paises", status_code=201)
def create_paises(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["paises"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["paises"][new_id] = record
    return record

@router.put("/paises/{item_id}")
def update_paises(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["paises"]:
        DB_STORE["paises"][item_id].update(data)
        return DB_STORE["paises"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["paises"][item_id] = record
    return record

@router.delete("/paises/{item_id}")
def delete_paises(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["paises"]:
        del DB_STORE["paises"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["provincias"] = {1: {"id": 1, "nombre": "Provincia Ejemplo 1", "descripcion": "Provincia Ejemplo 1", "activo": True}}

@router.get("/provincias")
def list_provincias(db: Session = Depends(get_db)):
    return list(DB_STORE["provincias"].values())

@router.get("/provincias/{item_id}")
def get_provincias(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["provincias"]:
        return DB_STORE["provincias"][item_id]
    raise HTTPException(status_code=404, detail="Provincia no encontrado")

@router.post("/provincias", status_code=201)
def create_provincias(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["provincias"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["provincias"][new_id] = record
    return record

@router.put("/provincias/{item_id}")
def update_provincias(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["provincias"]:
        DB_STORE["provincias"][item_id].update(data)
        return DB_STORE["provincias"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["provincias"][item_id] = record
    return record

@router.delete("/provincias/{item_id}")
def delete_provincias(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["provincias"]:
        del DB_STORE["provincias"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["ubicaciones"] = {1: {"id": 1, "nombre": "Ubicación Ejemplo 1", "descripcion": "Ubicación Ejemplo 1", "activo": True}}

@router.get("/ubicaciones")
def list_ubicaciones(db: Session = Depends(get_db)):
    return list(DB_STORE["ubicaciones"].values())

@router.get("/ubicaciones/{item_id}")
def get_ubicaciones(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["ubicaciones"]:
        return DB_STORE["ubicaciones"][item_id]
    raise HTTPException(status_code=404, detail="Ubicación no encontrado")

@router.post("/ubicaciones", status_code=201)
def create_ubicaciones(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["ubicaciones"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["ubicaciones"][new_id] = record
    return record

@router.put("/ubicaciones/{item_id}")
def update_ubicaciones(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["ubicaciones"]:
        DB_STORE["ubicaciones"][item_id].update(data)
        return DB_STORE["ubicaciones"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["ubicaciones"][item_id] = record
    return record

@router.delete("/ubicaciones/{item_id}")
def delete_ubicaciones(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["ubicaciones"]:
        del DB_STORE["ubicaciones"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["zonas"] = {1: {"id": 1, "nombre": "Zona Ejemplo 1", "descripcion": "Zona Ejemplo 1", "activo": True}}

@router.get("/zonas")
def list_zonas(db: Session = Depends(get_db)):
    return list(DB_STORE["zonas"].values())

@router.get("/zonas/{item_id}")
def get_zonas(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["zonas"]:
        return DB_STORE["zonas"][item_id]
    raise HTTPException(status_code=404, detail="Zona no encontrado")

@router.post("/zonas", status_code=201)
def create_zonas(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["zonas"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["zonas"][new_id] = record
    return record

@router.put("/zonas/{item_id}")
def update_zonas(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["zonas"]:
        DB_STORE["zonas"][item_id].update(data)
        return DB_STORE["zonas"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["zonas"][item_id] = record
    return record

@router.delete("/zonas/{item_id}")
def delete_zonas(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["zonas"]:
        del DB_STORE["zonas"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["colegios-farmaceuticos"] = {1: {"id": 1, "nombre": "Colegio Farmacéutico Ejemplo 1", "descripcion": "Colegio Farmacéutico Ejemplo 1", "activo": True}}

@router.get("/colegios-farmaceuticos")
def list_colegios_farmaceuticos(db: Session = Depends(get_db)):
    return list(DB_STORE["colegios-farmaceuticos"].values())

@router.get("/colegios-farmaceuticos/{item_id}")
def get_colegios_farmaceuticos(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["colegios-farmaceuticos"]:
        return DB_STORE["colegios-farmaceuticos"][item_id]
    raise HTTPException(status_code=404, detail="Colegio Farmacéutico no encontrado")

@router.post("/colegios-farmaceuticos", status_code=201)
def create_colegios_farmaceuticos(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["colegios-farmaceuticos"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["colegios-farmaceuticos"][new_id] = record
    return record

@router.put("/colegios-farmaceuticos/{item_id}")
def update_colegios_farmaceuticos(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["colegios-farmaceuticos"]:
        DB_STORE["colegios-farmaceuticos"][item_id].update(data)
        return DB_STORE["colegios-farmaceuticos"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["colegios-farmaceuticos"][item_id] = record
    return record

@router.delete("/colegios-farmaceuticos/{item_id}")
def delete_colegios_farmaceuticos(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["colegios-farmaceuticos"]:
        del DB_STORE["colegios-farmaceuticos"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["categorias-medicamentos"] = {1: {"id": 1, "nombre": "Categoría Ejemplo 1", "descripcion": "Categoría Ejemplo 1", "activo": True}}

@router.get("/categorias-medicamentos")
def list_categorias_medicamentos(db: Session = Depends(get_db)):
    return list(DB_STORE["categorias-medicamentos"].values())

@router.get("/categorias-medicamentos/{item_id}")
def get_categorias_medicamentos(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["categorias-medicamentos"]:
        return DB_STORE["categorias-medicamentos"][item_id]
    raise HTTPException(status_code=404, detail="Categoría no encontrado")

@router.post("/categorias-medicamentos", status_code=201)
def create_categorias_medicamentos(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["categorias-medicamentos"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["categorias-medicamentos"][new_id] = record
    return record

@router.put("/categorias-medicamentos/{item_id}")
def update_categorias_medicamentos(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["categorias-medicamentos"]:
        DB_STORE["categorias-medicamentos"][item_id].update(data)
        return DB_STORE["categorias-medicamentos"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["categorias-medicamentos"][item_id] = record
    return record

@router.delete("/categorias-medicamentos/{item_id}")
def delete_categorias_medicamentos(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["categorias-medicamentos"]:
        del DB_STORE["categorias-medicamentos"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["tipos-patologias"] = {1: {"id": 1, "nombre": "Patología Ejemplo 1", "descripcion": "Patología Ejemplo 1", "activo": True}}

@router.get("/tipos-patologias")
def list_tipos_patologias(db: Session = Depends(get_db)):
    return list(DB_STORE["tipos-patologias"].values())

@router.get("/tipos-patologias/{item_id}")
def get_tipos_patologias(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["tipos-patologias"]:
        return DB_STORE["tipos-patologias"][item_id]
    raise HTTPException(status_code=404, detail="Patología no encontrado")

@router.post("/tipos-patologias", status_code=201)
def create_tipos_patologias(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["tipos-patologias"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["tipos-patologias"][new_id] = record
    return record

@router.put("/tipos-patologias/{item_id}")
def update_tipos_patologias(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["tipos-patologias"]:
        DB_STORE["tipos-patologias"][item_id].update(data)
        return DB_STORE["tipos-patologias"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["tipos-patologias"][item_id] = record
    return record

@router.delete("/tipos-patologias/{item_id}")
def delete_tipos_patologias(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["tipos-patologias"]:
        del DB_STORE["tipos-patologias"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["especialidades-medicas"] = {1: {"id": 1, "nombre": "Especialidad Ejemplo 1", "descripcion": "Especialidad Ejemplo 1", "activo": True}}

@router.get("/especialidades-medicas")
def list_especialidades_medicas(db: Session = Depends(get_db)):
    return list(DB_STORE["especialidades-medicas"].values())

@router.get("/especialidades-medicas/{item_id}")
def get_especialidades_medicas(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["especialidades-medicas"]:
        return DB_STORE["especialidades-medicas"][item_id]
    raise HTTPException(status_code=404, detail="Especialidad no encontrado")

@router.post("/especialidades-medicas", status_code=201)
def create_especialidades_medicas(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["especialidades-medicas"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["especialidades-medicas"][new_id] = record
    return record

@router.put("/especialidades-medicas/{item_id}")
def update_especialidades_medicas(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["especialidades-medicas"]:
        DB_STORE["especialidades-medicas"][item_id].update(data)
        return DB_STORE["especialidades-medicas"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["especialidades-medicas"][item_id] = record
    return record

@router.delete("/especialidades-medicas/{item_id}")
def delete_especialidades_medicas(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["especialidades-medicas"]:
        del DB_STORE["especialidades-medicas"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["observaciones"] = {1: {"id": 1, "nombre": "Observación Ejemplo 1", "descripcion": "Observación Ejemplo 1", "activo": True}}

@router.get("/observaciones")
def list_observaciones(db: Session = Depends(get_db)):
    return list(DB_STORE["observaciones"].values())

@router.get("/observaciones/{item_id}")
def get_observaciones(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["observaciones"]:
        return DB_STORE["observaciones"][item_id]
    raise HTTPException(status_code=404, detail="Observación no encontrado")

@router.post("/observaciones", status_code=201)
def create_observaciones(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["observaciones"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["observaciones"][new_id] = record
    return record

@router.put("/observaciones/{item_id}")
def update_observaciones(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["observaciones"]:
        DB_STORE["observaciones"][item_id].update(data)
        return DB_STORE["observaciones"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["observaciones"][item_id] = record
    return record

@router.delete("/observaciones/{item_id}")
def delete_observaciones(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["observaciones"]:
        del DB_STORE["observaciones"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["vinculos"] = {1: {"id": 1, "nombre": "Vínculo Ejemplo 1", "descripcion": "Vínculo Ejemplo 1", "activo": True}}

@router.get("/vinculos")
def list_vinculos(db: Session = Depends(get_db)):
    return list(DB_STORE["vinculos"].values())

@router.get("/vinculos/{item_id}")
def get_vinculos(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["vinculos"]:
        return DB_STORE["vinculos"][item_id]
    raise HTTPException(status_code=404, detail="Vínculo no encontrado")

@router.post("/vinculos", status_code=201)
def create_vinculos(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["vinculos"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["vinculos"][new_id] = record
    return record

@router.put("/vinculos/{item_id}")
def update_vinculos(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["vinculos"]:
        DB_STORE["vinculos"][item_id].update(data)
        return DB_STORE["vinculos"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["vinculos"][item_id] = record
    return record

@router.delete("/vinculos/{item_id}")
def delete_vinculos(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["vinculos"]:
        del DB_STORE["vinculos"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["periodos"] = {1: {"id": 1, "nombre": "Período Ejemplo 1", "descripcion": "Período Ejemplo 1", "activo": True}}

@router.get("/periodos")
def list_periodos(db: Session = Depends(get_db)):
    return list(DB_STORE["periodos"].values())

@router.get("/periodos/{item_id}")
def get_periodos(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["periodos"]:
        return DB_STORE["periodos"][item_id]
    raise HTTPException(status_code=404, detail="Período no encontrado")

@router.post("/periodos", status_code=201)
def create_periodos(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["periodos"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["periodos"][new_id] = record
    return record

@router.put("/periodos/{item_id}")
def update_periodos(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["periodos"]:
        DB_STORE["periodos"][item_id].update(data)
        return DB_STORE["periodos"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["periodos"][item_id] = record
    return record

@router.delete("/periodos/{item_id}")
def delete_periodos(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["periodos"]:
        del DB_STORE["periodos"][item_id]
    return {"status": "deleted", "id": item_id}

DB_STORE["droguerias"] = {1: {"id": 1, "nombre": "Droguería Ejemplo 1", "descripcion": "Droguería Ejemplo 1", "activo": True}}

@router.get("/droguerias")
def list_droguerias(db: Session = Depends(get_db)):
    return list(DB_STORE["droguerias"].values())

@router.get("/droguerias/{item_id}")
def get_droguerias(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["droguerias"]:
        return DB_STORE["droguerias"][item_id]
    raise HTTPException(status_code=404, detail="Droguería no encontrado")

@router.post("/droguerias", status_code=201)
def create_droguerias(data: Dict[str, Any], db: Session = Depends(get_db)):
    new_id = len(DB_STORE["droguerias"]) + 100
    record = {"id": new_id, **data}
    DB_STORE["droguerias"][new_id] = record
    return record

@router.put("/droguerias/{item_id}")
def update_droguerias(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    if item_id in DB_STORE["droguerias"]:
        DB_STORE["droguerias"][item_id].update(data)
        return DB_STORE["droguerias"][item_id]
    record = {"id": item_id, **data}
    DB_STORE["droguerias"][item_id] = record
    return record

@router.delete("/droguerias/{item_id}")
def delete_droguerias(item_id: int, db: Session = Depends(get_db)):
    if item_id in DB_STORE["droguerias"]:
        del DB_STORE["droguerias"][item_id]
    return {"status": "deleted", "id": item_id}
