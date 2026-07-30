from typing import Callable, List
from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError

from app.core.database import get_db
from app.core.security import decode_token
from app.core.exceptions import BusinessException
from app.repositories.auth_repository import AuthRepository
from app.models.auth_models import Usuario

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise BusinessException("Token de acceso requerido", code="INVALID_TOKEN", status_code=status.HTTP_401_UNAUTHORIZED)
        
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError):
        raise BusinessException("Token inválido o expirado", code="UNAUTHORIZED", status_code=status.HTTP_401_UNAUTHORIZED)

    repo = AuthRepository(db)
    user = repo.get_by_id(user_id)
    if not user or not user.activo:
        raise BusinessException("Usuario inactivo o no encontrado", code="UNAUTHORIZED", status_code=status.HTTP_401_UNAUTHORIZED)

    return user

def require_permission(required_perm: str) -> Callable:
    def dependency(current_user: Usuario = Depends(get_current_user)) -> Usuario:
        user_perms = {rp.permiso.codigo for ur in current_user.roles for rp in ur.rol.permisos}
        if required_perm not in user_perms:
            raise BusinessException(
                f"Permiso insuficiente: se requiere {required_perm}",
                code="FORBIDDEN",
                status_code=status.HTTP_403_FORBIDDEN
            )
        return current_user
    return dependency
