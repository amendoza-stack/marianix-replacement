from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import json
from app.database import get_db
from app.models.auth_models import Usuario, Rol, UsuarioRol

router = APIRouter(prefix="/api/v1/seguridad", tags=["Seguridad"])

DEFAULT_MODULOS = [
    {"moduloId": "dash", "moduloNombre": "Dashboard General / KPIs", "categoria": "GENERAL", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "usr", "moduloNombre": "Usuarios y Accesos", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": True, "auditoria": True},
    {"moduloId": "rol", "moduloNombre": "Roles y Permisos", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": True, "auditoria": True},
    {"moduloId": "paises", "moduloNombre": "Países", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "prov", "moduloNombre": "Provincias", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "drog", "moduloNombre": "Droguerías", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "peri", "moduloNombre": "Períodos Fiscales", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "espe", "moduloNombre": "Especialidades Médicas", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "obse", "moduloNombre": "Observaciones", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "pato", "moduloNombre": "Patologías", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "ubic", "moduloNombre": "Ubicaciones", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "vinc", "moduloNombre": "Vínculos Familiares", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "zona", "moduloNombre": "Zonas Geo-Sanitarias", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "cole", "moduloNombre": "Colegios Farmacéuticos", "categoria": "CONFIGURACION", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "afil", "moduloNombre": "Padrón de Afiliados", "categoria": "GESTION_MEDICA", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "medi", "moduloNombre": "Padrón de Médicos", "categoria": "GESTION_MEDICA", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "os", "moduloNombre": "Obras Sociales y Prepagas", "categoria": "GESTION_MEDICA", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "plan", "moduloNombre": "Planes Cobertura", "categoria": "GESTION_MEDICA", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "farm", "moduloNombre": "Farmacias Prestadoras", "categoria": "GESTION_MEDICA", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "vademecum", "moduloNombre": "Plan Monodrogas / Vademécum", "categoria": "GESTION_MEDICA", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "lab", "moduloNombre": "Laboratorios", "categoria": "GESTION_MEDICA", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True},
    {"moduloId": "med", "moduloNombre": "Medicamentos", "categoria": "MEDICAMENTOS", "lectura": True, "escritura": True, "eliminacion": True, "auditoria": True},
    {"moduloId": "bonif", "moduloNombre": "Bonificaciones", "categoria": "BONIFICACIONES", "lectura": True, "escritura": True, "eliminacion": False, "auditoria": True}
]

def _format_user(u: Usuario, db: Session) -> Dict[str, Any]:
    if not u:
        return {}
    nombre_val = u.nombre_completo or u.username or "Usuario Sin Nombre"
    roles_nombres = []
    try:
        ur_records = db.query(UsuarioRol).filter(UsuarioRol.usuario_id == u.id).all()
        rol_ids = [ur.rol_id for ur in ur_records]
        if rol_ids:
            roles_db = db.query(Rol).filter(Rol.id.in_(rol_ids)).all()
            roles_nombres = [r.nombre for r in roles_db]
    except Exception:
        pass

    return {
        "id": u.id,
        "codigo": f"USR-{u.id:04d}",
        "username": u.username,
        "email": u.email,
        "nombre": nombre_val,
        "nombre_completo": nombre_val,
        "activo": u.activo if u.activo is not None else True,
        "roles": roles_nombres
    }

def _format_rol(r: Rol) -> Dict[str, Any]:
    permisos_list = DEFAULT_MODULOS
    if hasattr(r, "permisos_json") and r.permisos_json:
        try:
            permisos_list = json.loads(r.permisos_json)
        except Exception:
            pass
    return {
        "id": r.id,
        "codigo": f"ROL-{r.id:03d}",
        "nombre": r.nombre,
        "descripcion": r.descripcion or f"Perfil de acceso {r.nombre}",
        "esSistema": r.nombre in ["SUPERADMIN", "ADMIN"],
        "activo": True,
        "permisos": permisos_list
    }

# --- USUARIOS ENDPOINTS ---
@router.get("/usuarios")
def list_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(Usuario).all()
    return [_format_user(u, db) for u in usuarios]

@router.get("/usuarios/{item_id}")
def get_usuarios(item_id: int, db: Session = Depends(get_db)):
    usr = db.query(Usuario).filter(Usuario.id == item_id).first()
    if not usr:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return _format_user(usr, db)

@router.post("/usuarios", status_code=201)
def create_usuarios(data: Dict[str, Any], db: Session = Depends(get_db)):
    nombre = data.get("nombre") or data.get("nombre_completo") or "Nuevo Usuario"
    username = data.get("username") or data.get("email", "").split("@")[0]
    email = data.get("email") or f"{username}@marianix.com"
    activo = data.get("activo", True)
    
    nuevo_usuario = Usuario(
        username=username,
        email=email,
        nombre_completo=nombre,
        hashed_password="pbkdf2:sha256:fake_hash",
        activo=activo
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    
    roles_enviados = data.get("roles", [])
    if roles_enviados:
        roles_db = db.query(Rol).filter(Rol.nombre.in_(roles_enviados)).all()
        for r in roles_db:
            db.add(UsuarioRol(usuario_id=nuevo_usuario.id, rol_id=r.id))
        db.commit()

    return _format_user(nuevo_usuario, db)

@router.put("/usuarios/{item_id}")
def update_usuarios(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    usr = db.query(Usuario).filter(Usuario.id == item_id).first()
    if not usr:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if "nombre" in data or "nombre_completo" in data:
        usr.nombre_completo = data.get("nombre") or data.get("nombre_completo")
    if "email" in data:
        usr.email = data["email"]
    if "username" in data:
        usr.username = data["username"]
    if "activo" in data:
        usr.activo = data["activo"]
        
    if "roles" in data:
        db.query(UsuarioRol).filter(UsuarioRol.usuario_id == usr.id).delete()
        roles_enviados = data.get("roles", [])
        if roles_enviados:
            roles_db = db.query(Rol).filter(Rol.nombre.in_(roles_enviados)).all()
            for r in roles_db:
                db.add(UsuarioRol(usuario_id=usr.id, rol_id=r.id))
                
    db.commit()
    db.refresh(usr)
    return _format_user(usr, db)

@router.delete("/usuarios/{item_id}")
def delete_usuarios(item_id: int, db: Session = Depends(get_db)):
    usr = db.query(Usuario).filter(Usuario.id == item_id).first()
    if not usr:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db.query(UsuarioRol).filter(UsuarioRol.usuario_id == usr.id).delete()
    db.delete(usr)
    db.commit()
    return {"message": "Usuario eliminado correctamente"}

# --- ROLES & PERMISOS ENDPOINTS ---
@router.get("/roles")
def list_roles(db: Session = Depends(get_db)):
    roles = db.query(Rol).all()
    if not roles:
        r1 = Rol(nombre="SUPERADMIN", descripcion="Acceso total al sistema y auditoría")
        r2 = Rol(nombre="AUDITOR", descripcion="Auditoría médica y control de prestaciones")
        db.add_all([r1, r2])
        db.commit()
        roles = db.query(Rol).all()
    return [_format_rol(r) for r in roles]

@router.post("/roles", status_code=201)
def create_rol(data: Dict[str, Any], db: Session = Depends(get_db)):
    nombre = data.get("nombre", "").strip().upper()
    if not nombre:
        raise HTTPException(status_code=400, detail="El nombre del rol es requerido")
    
    descripcion = data.get("descripcion", f"Perfil de acceso {nombre}")
    permisos = data.get("permisos", DEFAULT_MODULOS)
    
    nuevo_rol = Rol(
        nombre=nombre,
        descripcion=descripcion
    )
    if hasattr(Rol, "permisos_json"):
        nuevo_rol.permisos_json = json.dumps(permisos)
        
    db.add(nuevo_rol)
    db.commit()
    db.refresh(nuevo_rol)
    return _format_rol(nuevo_rol)

@router.put("/roles/{item_id}")
def update_rol(item_id: int, data: Dict[str, Any], db: Session = Depends(get_db)):
    rol = db.query(Rol).filter(Rol.id == item_id).first()
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    
    if "nombre" in data:
        rol.nombre = data["nombre"].strip().upper()
    if "descripcion" in data:
        rol.descripcion = data["descripcion"]
    if "permisos" in data and hasattr(Rol, "permisos_json"):
        rol.permisos_json = json.dumps(data["permisos"])
        
    db.commit()
    db.refresh(rol)
    return _format_rol(rol)

@router.delete("/roles/{item_id}")
def delete_rol(item_id: int, db: Session = Depends(get_db)):
    rol = db.query(Rol).filter(Rol.id == item_id).first()
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    if rol.nombre in ["SUPERADMIN", "ADMIN"]:
        raise HTTPException(status_code=400, detail="No se pueden eliminar roles protegidos del sistema")
        
    db.delete(rol)
    db.commit()
    return {"message": "Rol eliminado correctamente"}