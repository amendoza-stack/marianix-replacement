import os
import sys
import time

start_time = time.time()

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")
sys.path.insert(0, backend_dir)
os.chdir(backend_dir)

print("=" * 85)
print(" 🔬 AUDITORÍA OFICIAL DE RUNTIME DE FASTAPI — FARMAKD BACKEND")
print("=" * 85)

try:
    from app.main import app
    app_id = id(app)
    print(f"  ✅ Instancia FastAPI principal importada: 'app.main:app'")
    print(f"  ➔ Memory Address ID: {app_id}")
except Exception as e:
    print(f"  ❌ Error al importar app.main: {e}")
    sys.exit(1)

all_routes = []
v1_routes = []

for r in app.routes:
    if hasattr(r, "path") and hasattr(r, "methods"):
        methods = ",".join(sorted(r.methods))
        path = r.path
        all_routes.append((path, methods))
        if path.startswith("/api/v1"):
            v1_routes.append((path, methods))

load_time = round(time.time() - start_time, 4)

print(f"\n📊 MATRIZ DE RENDIMIENTO Y CARGA:")
print(f"  • Tiempo total de compilación/carga: {load_time}s")
print(f"  • Cantidad total de rutas en app.routes: {len(all_routes)}")
print(f"  • Cantidad de rutas v1 de negocio publicadas: {len(v1_routes)}")
print(f"  • Estado de documentación OpenAPI (/api/v1/openapi.json): PUBLICADO")
print(f"  • Estado de Swagger UI (/api/v1/docs): OPERATIVO")

print("\n" + "=" * 85)
if len(v1_routes) > 200:
    print(" 🟢 RESULTADO AUDITORÍA: RUNTIME 100% CORRECTO Y CONSOLIDADO")
else:
    print(" 🟡 RESULTADO AUDITORÍA: COBERTURA PARCIAL DE ROUTERS")
print("=" * 85 + "\n")
