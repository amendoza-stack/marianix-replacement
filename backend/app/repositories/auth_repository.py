from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, or_
from app.models.auth_models import Usuario, Rol, Permiso, UsuarioRol, RolPermiso

class AuthRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_username_or_email(self, identifier: str) -> Optional[Usuario]:
        stmt = (
            select(Usuario)
            .options(
                joinedload(Usuario.roles)
                .joinedload(UsuarioRol.rol)
                .joinedload(Rol.permisos)
                .joinedload(RolPermiso.permiso)
            )
            .where(or_(Usuario.username == identifier, Usuario.email == identifier))
        )
        return self.db.execute(stmt).scalars().first()

    def get_by_id(self, user_id: int) -> Optional[Usuario]:
        stmt = (
            select(Usuario)
            .options(
                joinedload(Usuario.roles)
                .joinedload(UsuarioRol.rol)
                .joinedload(Rol.permisos)
                .joinedload(RolPermiso.permiso)
            )
            .where(Usuario.id == user_id)
        )
        return self.db.execute(stmt).scalars().first()

    def save(self, usuario: Usuario) -> Usuario:
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario
