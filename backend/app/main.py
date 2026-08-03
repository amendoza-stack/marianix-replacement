import importlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="FarmakD ERP - API Gateway",
    version="1.0.0",
    docs_url="/api/v1/docs",
    openapi_url="/api/v1/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

modules_to_mount = [
    "app.routers.auth",
    "app.routers.seguridad",
    "app.routers.permisos",
    "app.routers.configuracion",
    "app.routers.medica",
    "app.routers.obras_sociales",
    "app.routers.laboratorios",
    "app.routers.salud_ext",
    "app.routers.medicamentos",
    "app.routers.bonificaciones",
    "app.routers.importaciones",
    "app.routers.exportaciones",
    "app.api.v1.afiliados_router",
    "app.api.v1.configuracion_router",
    "app.api.v1.gestion_medica_router",
    "app.api.v1.receta_router",
    "app.api.v1.reportes_router",
    "app.api.v1.dashboard_router",
    "app.api.v1.endpoints.auth",
    "app.api.v1.endpoints.health"
]

def _register_module_routes(target_app, mod_path):
    try:
        mod = importlib.import_module(mod_path)
        sub_r = getattr(mod, "router", None) or getattr(mod, "api_router", None)
        if sub_r and hasattr(sub_r, "routes"):
            for rt in sub_r.routes:
                target_app.add_api_route(
                    path=rt.path,
                    endpoint=rt.endpoint,
                    methods=rt.methods,
                    response_model=getattr(rt, 'response_model', None),
                    status_code=getattr(rt, 'status_code', None),
                    tags=getattr(rt, 'tags', None),
                    summary=getattr(rt, 'summary', None),
                    description=getattr(rt, 'description', None),
                    name=getattr(rt, 'name', None)
                )
    except Exception as e:
        print(f"❌ Error al cargar módulo {mod_path}: {e}")

# Registro secuencial de los 20 módulos
for mod_path in modules_to_mount:
    _register_module_routes(app, mod_path)

@app.get("/")
def root():
    return {"message": "FarmakD ERP API v1 Operativa", "docs": "/api/v1/docs"}
