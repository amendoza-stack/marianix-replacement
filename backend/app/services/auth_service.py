import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.repositories.auth_repository import AuthRepository
from app.core.security import verify_password, create_token, decode_token, get_password_hash
from app.core.exceptions import BusinessException
from app.schemas.auth_schemas import TokenResponse, UserSummary
from jose import JWTError

class AuthService:
    def __init__(self, db: Session):
        self.repo = AuthRepository(db)

    def authenticate(self, username_or_email: str, password: str) -> TokenResponse:
        user = self.repo.get_by_username_or_email(username_or_email)
        
        if not user:
            raise BusinessException("Credenciales inválidas", code="INVALID_CREDENTIALS", status_code=401)

        if not user.activo:
            raise BusinessException("La cuenta de usuario está desactivada", code="ACCOUNT_DISABLED", status_code=403)

        # Control de Bloqueo por Intentos Fallidos
        if user.bloqueado_hasta and user.bloqueado_hasta > datetime.now(timezone.utc).replace(tzinfo=None):
            raise BusinessException("Cuenta bloqueada por múltiples intentos fallidos. Intente más tarde.", code="ACCOUNT_LOCKED", status_code=403)

        if not verify_password(password, user.hashed_password):
            user.intentos_fallidos += 1
            if user.intentos_fallidos >= 3:
                user.bloqueado_hasta = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=15)
                self.repo.save(user)
                raise BusinessException("Cuenta bloqueada por 15 minutos tras 3 intentos fallidos", code="ACCOUNT_LOCKED", status_code=403)
            self.repo.save(user)
            raise BusinessException("Credenciales inválidas", code="INVALID_CREDENTIALS", status_code=401)

        # Resetear intentos si se autentica correctamente
        user.intentos_fallidos = 0
        user.bloqueado_hasta = None
        self.repo.save(user)

        return self._build_token_response(user)

    def refresh_tokens(self, refresh_token: str) -> TokenResponse:
        try:
            payload = decode_token(refresh_token)
            if payload.get("type") != "refresh":
                raise BusinessException("Token inválido", code="INVALID_TOKEN", status_code=401)
            
            user_id = int(payload.get("sub"))
            user = self.repo.get_by_id(user_id)
            if not user or not user.activo:
                raise BusinessException("Usuario no encontrado o inactivo", code="UNAUTHORIZED", status_code=401)

            return self._build_token_response(user)
        except JWTError:
            raise BusinessException("Refresh token expirado o corrupto", code="INVALID_TOKEN", status_code=401)

    def request_password_reset(self, email: str) -> str:
        user = self.repo.get_by_username_or_email(email)
        if not user:
            return "Si el email existe, se enviarán las instrucciones."
        
        token = str(uuid.uuid4())
        user.reset_password_token = token
        user.reset_token_expires = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(hours=1)
        self.repo.save(user)
        return token

    def reset_password(self, token: str, new_password: str):
        user = self.repo.get_by_username_or_email(token) # En producción se busca por campo token
        # Búsqueda directa por token
        stmt_user = self.repo.db.query(self.repo.db.models.Usuario if hasattr(self.repo.db, 'models') else user.__class__).filter_by(reset_password_token=token).first()
        
        if not stmt_user or not stmt_user.reset_token_expires or stmt_user.reset_token_expires < datetime.now(timezone.utc).replace(tzinfo=None):
            raise BusinessException("Token de recuperación inválido o expirado", code="INVALID_RESET_TOKEN", status_code=400)

        stmt_user.hashed_password = get_password_hash(new_password)
        stmt_user.reset_password_token = None
        stmt_user.reset_token_expires = None
        self.repo.save(stmt_user)

    def _build_token_response(self, user) -> TokenResponse:
        access_token = create_token(user.id, token_type="access")
        refresh_token = create_token(user.id, token_type="refresh")

        roles = [ur.rol.nombre for ur in user.roles]
        permisos = list({rp.permiso.codigo for ur in user.roles for rp in ur.rol.permisos})

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user_info=UserSummary(
                id=user.id,
                username=user.username,
                email=user.email,
                nombre_completo=user.nombre_completo,
                roles=roles,
                permisos=permisos
            )
        )
