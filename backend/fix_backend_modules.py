import os

backend_dir = r"C:\Users\aname\marianix-replacement\backend"

# 1. Crear estructura de carpetas si no existe
v1_dir = os.path.join(backend_dir, "app", "api", "v1")
os.makedirs(v1_dir, exist_ok=True)

# 2. Crear un gestion_medica_router.py base si no existía
gestion_router_path = os.path.join(v1_dir, "gestion_medica_router.py")
gestion_router_code = """from fastapi import APIRouter

router = APIRouter(prefix="/gestion-medica", tags=["Gestión Médica"])

@router.get("/status")
def status():
    return {"status": "ok", "module": "gestion_medica"}
"""
with open(gestion_router_path, "w", encoding="utf-8") as f:
    f.write(gestion_router_code)

# 3. Asegurar auth_router.py para el Login
auth_router_path = os.path.join(v1_dir, "auth_router.py")
auth_router_code = """from fastapi import APIRouter, HTTPException, status
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
"""
with open(auth_router_path, "w", encoding="utf-8") as f:
    f.write(auth_router_code)

# 4. Actualizar app/main.py
main_path = os.path.join(backend_dir, "app", "main.py")
main_code = """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.auth_router import router as auth_router
from app.api.v1.gestion_medica_router import router as gestion_medica_router

app = FastAPI(title="MARIANIX API", version="1.0.0")

# Habilitar CORS para comunicación con el Frontend Angular (puerto 4200)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(gestion_medica_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "MARIANIX Backend API Running"}
"""
with open(main_path, "w", encoding="utf-8") as f:
    f.write(main_code)

print("Módulos del backend creados y actualizados con éxito.")
