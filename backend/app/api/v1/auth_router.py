from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Autenticación"])

class LoginSchema(BaseModel):
    username_or_email: str
    password: str
    remember_me: bool = False

@router.post("/login")
def login(credentials: LoginSchema):
    # Credenciales de prueba / desarrollo
    if credentials.username_or_email in ["amendoza@farmakd.com", "admin"] and credentials.password == "123456":
        return {
            "access_token": "fake-jwt-token-access-12345",
            "refresh_token": "fake-jwt-token-refresh-67890",
            "token_type": "bearer",
            "user": {
                "id": 1,
                "username": "amendoza",
                "email": "amendoza@farmakd.com",
                "roles": ["ADMINISTRADOR"],
                "permisos": ["RECETAS_CREAR", "RECETAS_LEER", "REPORTES_EXPORTAR"]
            }
        }
    
    # En caso de credenciales inválidas en modo demo, aceptamos cualquier login para desarrollo o retornamos 401 si falla
    return {
        "access_token": "fake-jwt-token-access-marianix",
        "refresh_token": "fake-jwt-token-refresh-marianix",
        "token_type": "bearer",
        "user": {
            "id": 1,
            "username": credentials.username_or_email.split('@')[0],
            "email": credentials.username_or_email,
            "roles": ["OPERADOR"],
            "permisos": ["RECETAS_CREAR", "RECETAS_LEER"]
        }
    }

@router.post("/refresh")
def refresh_token(body: dict):
    return {"access_token": "new-fake-jwt-token-access-777"}
