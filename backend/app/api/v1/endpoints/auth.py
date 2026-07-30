from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.auth_schemas import (
    LoginRequest, TokenResponse, RefreshTokenRequest, 
    ForgotPasswordRequest, ResetPasswordRequest, MessageResponse, UserSummary
)
from app.services.auth_service import AuthService
from app.models.auth_models import Usuario

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Inicio de sesión con Username o Email. Retorna Access (60m) y Refresh (8h) Token."""
    service = AuthService(db)
    return service.authenticate(request.username_or_email, request.password)

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Renueva el Access Token utilizando un Refresh Token válido."""
    service = AuthService(db)
    return service.refresh_tokens(request.refresh_token)

@router.post("/logout", response_model=MessageResponse)
def logout(current_user: Usuario = Depends(get_current_user)):
    """Cierra la sesión del usuario actual (Stateless Token Invalidation)."""
    return MessageResponse(message="Sesión cerrada exitosamente")

@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Solicita un token de recuperación de contraseña."""
    service = AuthService(db)
    token = service.request_password_reset(request.email)
    return MessageResponse(message=f"Instrucciones enviadas al correo. (Token Dev: {token})")

@router.post("/reset-password", response_model=MessageResponse)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Restablece la contraseña utilizando el token recibido."""
    service = AuthService(db)
    service.reset_password(request.token, request.new_password)
    return MessageResponse(message="Contraseña actualizada correctamente")

@router.get("/me", response_model=UserSummary)
def get_me(current_user: Usuario = Depends(get_current_user)):
    """Obtiene el perfil y permisos del usuario autenticado."""
    roles = [ur.rol.nombre for ur in current_user.roles]
    permisos = list({rp.permiso.codigo for ur in current_user.roles for rp in ur.rol.permisos})
    return UserSummary(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        nombre_completo=current_user.nombre_completo,
        roles=roles,
        permisos=permisos
    )
