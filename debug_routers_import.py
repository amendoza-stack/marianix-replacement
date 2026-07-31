import os
import sys

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

print("==========================================================================================")
print("             DIAGNÓSTICO DE IMPORTACIÓN DE ROUTERS EN REPOSITORIO                         ")
print("==========================================================================================")

routers_list = [
    "auth",
    "configuracion",
    "seguridad",
    "medica",
    "salud_ext",
    "medicamentos",
    "bonificaciones",
    "exportaciones",
    "importaciones"
]

for r_name in routers_list:
    try:
        mod = __import__(f"app.routers.{r_name}", fromlist=["router"])
        if hasattr(mod, "router"):
            routes_count = len(mod.router.routes)
            print(f"✅ [OK] app.routers.{r_name:<20} -> Objeto 'router' encontrado ({routes_count} rutas definidas)")
        else:
            print(f"❌ [NO ROUTER] app.routers.{r_name:<16} -> El módulo NO contiene la variable 'router'")
    except Exception as e:
        print(f"💥 [ERROR IMPORT] app.routers.{r_name:<15} -> {type(e).__name__}: {e}")

print("==========================================================================================")
