import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.core.database import SessionLocal, engine, Base
from app.models.auth_models import Permiso, Rol, RolPermiso

def seed_permissions():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # 1. Definición de Permisos
        permisos_def = [
            ("RECETAS_CREATE", "Crear Recetas"),
            ("RECETAS_READ", "Consultar Recetas"),
            ("RECETAS_UPDATE", "Editar Recetas"),
            ("RECETAS_DELETE", "Eliminar Recetas"),
            ("AUDITORIA_VIEW", "Ver Logs de Auditoria"),
            ("REPORTES_331", "Generar Reporte 331"),
            ("ADMIN_USERS", "Gestionar Usuarios y Roles")
        ]

        permisos_objs = {}
        for codigo, nombre in permisos_def:
            p = db.query(Permiso).filter_by(codigo=codigo).first()
            if not p:
                p = Permiso(codigo=codigo, nombre=nombre)
                db.add(p)
                db.flush()
            permisos_objs[codigo] = p

        # 2. Roles
        rol_admin = db.query(Rol).filter_by(nombre="ADMIN").first()
        if not rol_admin:
            rol_admin = Rol(nombre="ADMIN", descripcion="Administrador Global del Sistema")
            db.add(rol_admin)
            db.flush()

        # Asignar todos los permisos a ADMIN
        for p in permisos_objs.values():
            rp = db.query(RolPermiso).filter_by(rol_id=rol_admin.id, permiso_id=p.id).first()
            if not rp:
                db.add(RolPermiso(rol_id=rol_admin.id, permiso_id=p.id))

        db.commit()
        print("✅ Permisos y Rol ADMIN creados exitosamente.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error al crear permisos: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_permissions()
