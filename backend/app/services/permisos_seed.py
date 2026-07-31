import logging
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
