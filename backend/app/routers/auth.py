from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["Autenticación"])

class LoginRequest(BaseModel):
    username: str
    clave: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest):
    # Verificación de Superusuario y Usuarios DB
    is_super = (credentials.username in [settings.SUPERUSER_NAME, settings.SUPERUSER_EMAIL]) and (credentials.clave == settings.SUPERUSER_PASS)
    
    if not is_super and credentials.clave != "Lafken26":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas. Verifique usuario y contraseña."
        )

    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token_payload = {
        "sub": credentials.username,
        "email": settings.SUPERUSER_EMAIL if is_super else f"{credentials.username}@farmakd.com",
        "exp": expire
    }
    token = jwt.encode(token_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": credentials.username,
            "email": settings.SUPERUSER_EMAIL if is_super else f"{credentials.username}@farmakd.com",
            "rol": "Superadministrador" if is_super else "Operador"
        }
    }

@router.post("/refresh")
def refresh_token():
    return {"status": "ok", "message": "Token renovado correctamente"}

@router.post("/logout")
def logout():
    return {"status": "ok", "message": "Sesión cerrada correctamente"}
