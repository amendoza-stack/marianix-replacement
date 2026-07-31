import os

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
app_dir = os.path.join(backend_dir, "app")
routers_dir = os.path.join(app_dir, "routers")

os.makedirs(routers_dir, exist_ok=True)

# 1. ROUTER DE CONFIGURACIÓN AUXILIAR (routers/configuracion.py)
config_router = """from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db

router = APIRouter(prefix="/api/v1/config", tags=["Configuración"])

def generic_mock_list(nombre: str):
    return [{"id": 1, "nombre": f"{nombre} Ejemplo 1", "activo": True}, {"id": 2, "nombre": f"{nombre} Ejemplo 2", "activo": True}]

@router.get("/paises")
def get_paises(db: Session = Depends(get_db)): return generic_mock_list("País")

@router.get("/provincias")
def get_provincias(db: Session = Depends(get_db)): return generic_mock_list("Provincia")

@router.get("/ubicaciones")
def get_ubicaciones(db: Session = Depends(get_db)): return generic_mock_list("Ubicación")

@router.get("/zonas")
def get_zonas(db: Session = Depends(get_db)): return generic_mock_list("Zona")

@router.get("/colegios-farmaceuticos")
def get_colegios(db: Session = Depends(get_db)): return generic_mock_list("Colegio Farmacéutico")

@router.get("/categorias-medicamentos")
def get_categorias(db: Session = Depends(get_db)): return generic_mock_list("Categoría")

@router.get("/tipos-patologias")
def get_patologias(db: Session = Depends(get_db)): return generic_mock_list("Patología")

@router.get("/especialidades-medicas")
def get_especialidades(db: Session = Depends(get_db)): return generic_mock_list("Especialidad")

@router.get("/observaciones")
def get_observaciones(db: Session = Depends(get_db)): return generic_mock_list("Observación")

@router.get("/vinculos")
def get_vinculos(db: Session = Depends(get_db)): return generic_mock_list("Vínculo")

@router.get("/periodos")
def get_periodos(db: Session = Depends(get_db)): return generic_mock_list("Período")

@router.get("/droguerias")
def get_droguerias(db: Session = Depends(get_db)): return generic_mock_list("Droguería")
"""
with open(os.path.join(routers_dir, "configuracion.py"), "w", encoding="utf-8") as f:
    f.write(config_router)

# 2. ROUTER DE SEGURIDAD (routers/seguridad.py)
seguridad_router = """from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/v1/seguridad", tags=["Seguridad"])

@router.get("/usuarios")
def get_usuarios(db: Session = Depends(get_db)):
    return [{"id": 1, "username": "anamendoza", "email": "amendoza@farmakd.com", "activo": True}]

@router.get("/roles")
def get_roles(db: Session = Depends(get_db)):
    return [{"id": 1, "nombre": "Administrador", "descripcion": "Control Total"}, {"id": 2, "nombre": "Operador", "descripcion": "Operaciones Básicas"}]
"""
with open(os.path.join(routers_dir, "seguridad.py"), "w", encoding="utf-8") as f:
    f.write(seguridad_router)

# 3. ROUTER DE GESTIÓN MÉDICA (routers/medica.py)
medica_router = """from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/v1/medica", tags=["Gestión Médica"])

@router.get("/afiliados")
def get_afiliados(db: Session = Depends(get_db)):
    return [{"id": 1, "nombre": "Juan Pérez", "documento": "30111222", "activo": True}]

@router.get("/medicos")
def get_medicos(db: Session = Depends(get_db)):
    return [{"id": 1, "nombre": "Dr. Carlos Gómez", "matricula": "M-4512", "activo": True}]
"""
with open(os.path.join(routers_dir, "medica.py"), "w", encoding="utf-8") as f:
    f.write(medica_router)

# 4. ROUTER DE MEDICAMENTOS (routers/medicamentos.py)
meds_router = """from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/v1/medicamentos", tags=["Medicamentos"])

@router.get("/drogas")
def get_drogas(db: Session = Depends(get_db)): return [{"id": 1, "nombre": "Ibuprofeno"}]

@router.get("/monodrogas")
def get_monodrogas(db: Session = Depends(get_db)): return [{"id": 1, "nombre": "Paracetamol"}]

@router.get("/potencias")
def get_potencias(db: Session = Depends(get_db)): return [{"id": 1, "valor": "500 mg"}]

@router.get("/formas")
def get_formas(db: Session = Depends(get_db)): return [{"id": 1, "nombre": "Comprimidos"}]

@router.get("/vias")
def get_vias(db: Session = Depends(get_db)): return [{"id": 1, "nombre": "Oral"}]

@router.get("/acciones")
def get_acciones(db: Session = Depends(get_db)): return [{"id": 1, "nombre": "Analgésico"}]

@router.get("/maestro")
def get_maestro(db: Session = Depends(get_db)): return [{"id": 1, "gtin": "7791234567890", "nombreComercial": "Ibuevanol 400"}]
"""
with open(os.path.join(routers_dir, "medicamentos.py"), "w", encoding="utf-8") as f:
    f.write(meds_router)

# 5. ROUTER DE BONIFICACIONES Y EXTENSIÓN SALUD (routers/bonificaciones.py & salud_ext.py)
bonif_router = """from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/v1/bonificaciones", tags=["Bonificaciones"])

@router.get("")
def get_bonificaciones(db: Session = Depends(get_db)):
    return [{"id": 1, "descripcion": "Bonificación Especial 10%", "porcentaje": 10.0}]
"""
with open(os.path.join(routers_dir, "bonificaciones.py"), "w", encoding="utf-8") as f:
    f.write(bonif_router)

# 6. INSCRIBIR TODOS LOS ROUTERS EN MAIN.PY
main_path = os.path.join(app_dir, "main.py")
with open(main_path, "r", encoding="utf-8") as f:
    main_code = f.read()

registros = """
from app.routers import configuracion, seguridad, medica, medicamentos, bonificaciones

app.include_router(configuracion.router)
app.include_router(seguridad.router)
app.include_router(medica.router)
app.include_router(medicamentos.router)
app.include_router(bonificaciones.router)
"""

if "configuracion.router" not in main_code:
    main_code += registros
    with open(main_path, "w", encoding="utf-8") as f:
        f.write(main_code)

print("✅ Todos los Routers han sido creados e inscriptos en main.py correctamente.")
