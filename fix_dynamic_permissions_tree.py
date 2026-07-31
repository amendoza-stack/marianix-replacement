import os
import json

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
app_dir = os.path.join(backend_dir, "app")
routers_dir = os.path.join(app_dir, "routers")
services_dir = os.path.join(app_dir, "services")
frontend_dir = os.path.join(root_dir, "frontend")

os.makedirs(services_dir, exist_ok=True)
os.makedirs(routers_dir, exist_ok=True)

# ==============================================================================
# FASE 1, 2 & 6: SEEDER Y MATRIZ DINÁMICA DE PERMISOS (backend/app/services/permisos_seed.py)
# ==============================================================================
perm_seed_code = """import logging
from sqlalchemy.orm import Session
from app.models.seguridad import Permiso, Rol
from app.database import SessionLocal

logger = logging.getLogger("marianix_permissions")

# Definición estándar de acciones por recurso
ACCIONES_ESTANDAR = [
    ("CONSULTAR", "Consultar / Ver registros"),
    ("CREAR", "Crear nuevo registro"),
    ("MODIFICAR", "Modificar / Editar registro"),
    ("ELIMINAR", "Eliminar / Dar de baja"),
    ("EXPORTAR_EXCEL", "Exportar a Excel"),
    ("EXPORTAR_CSV", "Exportar a CSV"),
    ("IMPORTAR", "Importación masiva"),
    ("ADMINISTRAR", "Administración total")
]

# MATRIZ COMPLETA DE MÓDULOS DEL SISTEMA ERP (Incluye Medicamentos y Bonificaciones)
MATRIZ_MODULOS = {
    "Seguridad": [
        ("USUARIOS", "Usuarios"),
        ("ROLES", "Roles"),
        ("PERMISOS", "Permisos")
    ],
    "Configuración": [
        ("PAISES", "Países"),
        ("PROVINCIAS", "Provincias"),
        ("UBICACIONES", "Ubicaciones"),
        ("ZONAS", "Zonas"),
        ("COLEGIOS_FARMACEUTICOS", "Colegios Farmacéuticos"),
        ("CATEGORIAS_MEDICAMENTOS", "Categorías"),
        ("ESPECIALIDADES_MEDICAS", "Especialidades"),
        ("OBSERVACIONES", "Observaciones"),
        ("VINCULOS", "Vínculos"),
        ("PERIODOS", "Períodos"),
        ("DROGUERIAS", "Droguerías")
    ],
    "Gestión Médica": [
        ("AFILIADOS", "Afiliados"),
        ("MEDICOS", "Médicos")
    ],
    "Gestión Salud": [
        ("OBRAS_SOCIALES", "Obras Sociales"),
        ("PLANES", "Planes"),
        ("FARMACIAS_OS", "Farmacias OS"),
        ("PLAN_MONODROGA", "Plan/Monodroga"),
        ("LABORATORIOS", "Laboratorios"),
        ("FARMACIAS", "Farmacias")
    ],
    "Medicamentos": [
        ("DROGAS", "Drogas"),
        ("MONODROGAS", "Monodrogas"),
        ("POTENCIAS", "Potencias"),
        ("FORMAS_FARMACEUTICAS", "Formas Farmacéuticas"),
        ("VIAS_ADMINISTRACION", "Vías de Administración"),
        ("ACCIONES_TERAPEUTICAS", "Acciones Terapeuticas"),
        ("MAESTRO_MEDICAMENTOS", "Maestro de Medicamentos"),
        ("IMPORTADOR_NOVEDADES", "Importador de Novedades")
    ],
    "Bonificaciones": [
        ("BONIFICACIONES", "Bonificaciones"),
        ("EXPORTACION_OFICIAL", "Exportación Oficial")
    ],
    "Dashboard": [
        ("DASHBOARD", "Dashboard"),
        ("KPIS", "KPIs")
    ],
    "Reportes": [
        ("REPORTE_BONIFICACIONES", "Reporte Bonificaciones"),
        ("REPORTE_FARMACIAS", "Reporte Farmacias"),
        ("REPORTE_RECETAS", "Reporte Recetas"),
        ("REPORTE_331", "Reporte 331")
    ],
    "Auditoría": [
        ("LOGS", "Logs"),
        ("AUDITORIA", "Auditoría")
    ]
}

def sync_permissions_and_roles():
    db: Session = SessionLocal()
    try:
        logger.info("⚡ Sincronizando Matriz Completa de Permisos ERP...")
        total_created = 0

        for grupo_nombre, recursos in MATRIZ_MODULOS.items():
            grupo_key = grupo_nombre.upper().replace(" ", "_")
            for rec_key, rec_label in recursos:
                mod_key = f"{grupo_key}_{rec_key}"
                for acc_key, acc_desc in ACCIONES_ESTANDAR:
                    perm_code = f"{mod_key}_{acc_key}"
                    perm_name = f"{rec_label} - {acc_key.capitalize().replace('_', ' ')}"
                    
                    existing = db.query(Permiso).filter(Permiso.codigo == perm_code).first()
                    if not existing:
                        new_perm = Permiso(
                            codigo=perm_code,
                            nombre=perm_name,
                            modulo=grupo_nombre,  # Módulo padre (Ej: Medicamentos, Bonificaciones)
                            accion=acc_key,
                            descripcion=f"{rec_label} ({acc_desc})",
                            activo=True
                        )
                        db.add(new_perm)
                        total_created += 1

        db.commit()
        logger.info(f"✅ Sincronización de Permisos finalizada. Nuevos registros: {total_created}")

        # Rol Administrador obtiene la totalidad absoluta de permisos
        all_perms = db.query(Permiso).filter(Permiso.activo == True).all()
        admin_role = db.query(Rol).filter(Rol.nombre == "Administrador").first()
        if not admin_role:
            admin_role = Rol(nombre="Administrador", descripcion="Administrador Global del ERP")
            db.add(admin_role)
            db.commit()
        admin_role.permisos = all_perms
        db.commit()

    except Exception as e:
        db.rollback()
        logger.error(f"❌ Error sincronizando permisos: {str(e)}", exc_info=True)
    finally:
        db.close()
"""
with open(os.path.join(services_dir, "permisos_seed.py"), "w", encoding="utf-8") as f:
    f.write(perm_seed_code)

# ==============================================================================
# FASE 3: API ENDPOINT AGRUPADO DINÁMICAMENTE (backend/app/routers/permisos.py)
# ==============================================================================
router_permisos_code = """from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.seguridad import Permiso

router = APIRouter(prefix="/api/v1/permisos", tags=["Permisos"])

@router.get("", response_model=List[Dict[str, Any]])
def get_permisos_agrupados(db: Session = Depends(get_db)):
    \"\"\"
    Devuelve TODOS los permisos registrados en la DB agrupados jerárquicamente
    por Módulo Padre sin filtros hardcodeados.
    \"\"\"
    permisos = db.query(Permiso).filter(Permiso.activo == True).all()
    
    agrupados = {}
    for p in permisos:
        mod = p.modulo or "General"
        if mod not in agrupados:
            agrupados[mod] = []
        
        agrupados[mod].append({
            "id": p.id,
            "codigo": p.codigo,
            "nombre": p.nombre,
            "accion": p.accion,
            "descripcion": p.descripcion
        })

    # Formatear respuesta para el Árbol del Frontend
    resultado = []
    for modulo_nombre, lista_permisos in agrupados.items():
        resultado.append({
            "modulo": modulo_nombre,
            "permisos": lista_permisos
        })
        
    return resultado
"""
with open(os.path.join(routers_dir, "permisos.py"), "w", encoding="utf-8") as f:
    f.write(router_permisos_code)

# Inscribir router en main.py si no estaba agregado
main_py_path = os.path.join(app_dir, "main.py")
with open(main_py_path, "r", encoding="utf-8") as f:
    main_code = f.read()

if "permisos.router" not in main_code:
    main_code = main_code.replace("app.include_router(laboratorios.router)", "app.include_router(laboratorios.router)\nfrom app.routers import permisos\napp.include_router(permisos.router)")
    with open(main_py_path, "w", encoding="utf-8") as f:
        f.write(main_code)

print("✅ Sincronización dinámicas de Permisos Backend aplicada con éxito.")
