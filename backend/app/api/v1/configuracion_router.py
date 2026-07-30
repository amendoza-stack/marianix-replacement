from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Any, Dict

router = APIRouter(prefix="/configuracion", tags=["Módulo de Configuración"])

class GenericConfigSchema(BaseModel):
    id: Optional[int] = None
    codigo: Optional[str] = None
    nombre: str
    descripcion: Optional[str] = None
    activo: bool = True

MOCK_DBS: Dict[str, List[Dict[str, Any]]] = {
    "roles": [{"id": 1, "codigo": "ROL-ADMIN", "nombre": "Administrador General", "nivelAcceso": 1, "descripcion": "Acceso total sin restricciones", "activo": True}],
    "usuarios": [{"id": 1, "codigo": "LEG-1001", "username": "amendoza", "nombre": "Ana Mendoza", "email": "amendoza@farmakd.com", "rolId": 1, "descripcion": "Sistemas", "activo": True}],
    "paises": [{"id": 1, "codigo": "ARG", "isoCode": "ARG", "nombre": "Argentina", "cuitPrefix": "30", "descripcion": "Sudamérica", "activo": True}],
    "provincias": [{"id": 1, "codigo": "AR-B", "nombre": "Buenos Aires", "paisId": 1, "codigoJurisdiccion": "901", "descripcion": "Provincia de Bs As", "activo": True}],
    "ubicaciones": [{"id": 1, "codigo": "UBI-B1636", "codigoPostal": "B1636", "nombre": "Olivos", "provinciaId": 1, "descripcion": "Vicente López", "activo": True}],
    "zonas": [{"id": 1, "codigo": "ZONA-NOA", "nombre": "Noroste Argentino", "regionGeografica": "NOA", "supervisorResponsable": "Carlos Gómez", "descripcion": "Tucumán, Salta, Jujuy", "activo": True}],
    "colegios": [{"id": 1, "codigo": "COF-PBA", "nombre": "Colegio de Farmacéuticos Prov. Bs As", "cuit": "30-54123984-2", "numeroMatriculaGeneral": "MAT-9941", "descripcion": "Convenio 331", "activo": True}],
    "categorias": [{"id": 1, "codigo": "CAT-ONCO", "nombre": "Oncológicos & Tratamientos Especiales", "porcentajeSubsidioGeneral": 100, "descripcion": "Alto costo", "activo": True}],
    "patologias": [{"id": 1, "codigo": "PAT-E11", "cie10Code": "E11", "nombre": "Diabetes Mellitus Tipo II", "esCronica": True, "descripcion": "Protocolo Crónico", "activo": True}],
    "especialidades": [{"id": 1, "codigo": "ESP-CAR", "codigoSisa": "104", "nombre": "Cardiología y Angiología", "requiereMatriculaNacional": True, "descripcion": "Prescripción e-receta", "activo": True}],
    "observaciones": [{"id": 1, "codigo": "OBS-VAD-01", "nombre": "Medicamento Fuera de Vademécum", "esMotivoRechazo": True, "severidad": 3, "descripcion": "Sin cobertura en plan", "activo": True}],
    "vinculos": [{"id": 1, "codigo": "VIN-TIT", "nombre": "Titular Directo", "esTitular": True, "gradoParentesco": 0, "descripcion": "Afiliado titular", "activo": True}],
    "periodos": [{"id": 1, "codigo": "202607", "nombre": "Julio 2026", "fechaInicio": "2026-07-01", "fechaCierrePresentacion": "2026-07-31", "estaCerrado": False, "descripcion": "Período corriente", "activo": True}],
    "droguerias": [{"id": 1, "codigo": "DROG-SUD", "nombre": "Droguería del Sud S.A.", "cuit": "30-50001239-4", "glnCode": "7798000100012", "emailPedidos": "pedidos@drogueriadelsud.com.ar", "descripcion": "Proveedor directo", "activo": True}]
}

def make_endpoint_handlers(entity: str):
    @router.get(f"/{entity}", response_model=List[Dict[str, Any]])
    def get_list():
        return MOCK_DBS.get(entity, [])

    @router.post(f"/{entity}", status_code=status.HTTP_201_CREATED)
    def create_item(payload: Dict[str, Any]):
        db = MOCK_DBS.get(entity, [])
        new_id = max([i.get("id", 0) for i in db], default=0) + 1
        payload["id"] = new_id
        db.append(payload)
        return payload

    @router.put(f"/{entity}/{{item_id}}")
    def update_item(item_id: int, payload: Dict[str, Any]):
        db = MOCK_DBS.get(entity, [])
        for idx, item in enumerate(db):
            if item.get("id") == item_id:
                payload["id"] = item_id
                db[idx] = payload
                return payload
        raise HTTPException(status_code=404, detail="Registro no encontrado")

    @router.delete(f"/{entity}/{{item_id}}", status_code=status.HTTP_204_NO_CONTENT)
    def delete_item(item_id: int):
        if entity in MOCK_DBS:
            MOCK_DBS[entity] = [i for i in MOCK_DBS[entity] if i.get("id") != item_id]
        return None

for key in MOCK_DBS.keys():
    make_endpoint_handlers(key)