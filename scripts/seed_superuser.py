import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.auth_models import Usuario, Rol, UsuarioRol
from seed_permissions import seed_permissions

def seed_superuser():
    # Asegurar que existan roles y permisos primero
    seed_permissions()

    db = SessionLocal()
    try:
        username = "anamendoza"
        email = "amendoza@farmakd.com"
        password = "Lafken26"
        nombre_completo = "Ana Mendoza"

        # Buscar si ya existe
        user = db.query(Usuario).filter((Usuario.username == username) | (Usuario.email == email)).first()
        if not user:
            user = Usuario(
                username=username,
                email=email,
                hashed_password=get_password_hash(password),
                nombre_completo=nombre_completo,
                activo=True
            )
            db.add(user)
            db.flush()

            # Asignar Rol ADMIN
            rol_admin = db.query(Rol).filter_by(nombre="ADMIN").first()
            if rol_admin:
                db.add(UsuarioRol(usuario_id=user.id, rol_id=rol_admin.id))

            db.commit()
            print(f"✅ Superusuario '{username}' creado exitosamente.")
        else:
            print(f"ℹ️ El usuario '{username}' ya se encuentra registrado.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error al crear superusuario: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_superuser()
