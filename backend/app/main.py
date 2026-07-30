from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.auth_router import router as auth_router
from app.api.v1.gestion_medica_router import router as gestion_medica_router
from app.api.v1.dashboard_router import router as dashboard_router
from app.api.v1.afiliados_router import router as afiliados_router

app = FastAPI(title="MARIANIX API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(gestion_medica_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(afiliados_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "MARIANIX Backend API Running"}