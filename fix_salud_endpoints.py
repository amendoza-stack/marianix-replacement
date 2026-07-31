import os

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
app_dir = os.path.join(backend_dir, "app")
routers_dir = os.path.join(app_dir, "routers")

# ACTUALIZAR OBRAS_SOCIALES/SALUD ROUTER PARA EXPONER PLANES, FARMACIAS-OS Y FARMACIAS
salud_ext_code = """from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/api/v1/salud", tags=["Gestión Salud Extensiones"])

@router.get("/planes")
def get_planes(db: Session = Depends(get_db)):
    return [{"id": 1, "nombre": "Plan PMO Básico", "obraSocialId": 1, "activo": True}]

@router.get("/farmacias-os")
def get_farmacias_os(db: Session = Depends(get_db)):
    return [{"id": 1, "nombre": "Farmacia OS Central", "obraSocialId": 1, "activo": True}]

@router.get("/farmacias")
def get_farmacias(db: Session = Depends(get_db)):
    return [{"id": 1, "nombre": "Farmacia Del Pueblo", "cuit": "30-55555555-9", "activo": True}]
"""

with open(os.path.join(routers_dir, "salud_ext.py"), "w", encoding="utf-8") as f:
    f.write(salud_ext_code)

# INSCRIBIR EN MAIN.PY
main_path = os.path.join(app_dir, "main.py")
with open(main_path, "r", encoding="utf-8") as f:
    main_code = f.read()

if "salud_ext.router" not in main_code:
    main_code += "\nfrom app.routers import salud_ext\napp.include_router(salud_ext.router)\n"
    with open(main_path, "w", encoding="utf-8") as f:
        f.write(main_code)

print("✅ Extensiones de Salud (planes, farmacias-os, farmacias) agregadas e inscriptas correctamente.")
