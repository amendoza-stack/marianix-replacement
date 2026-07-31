import os
import sys

# 1. Asegurar ruta física prioritaria
root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# 2. Limpiar cache previo de 'app' si existiera
for k in list(sys.modules.keys()):
    if k == "app" or k.startswith("app."):
        del sys.modules[k]

from fastapi import FastAPI
from app.routers import (
    auth, configuracion, seguridad, medica,
    salud_ext, medicamentos, bonificaciones, exportaciones, importaciones
)

# 3. Ensamblado explícito en memoria
app_test = FastAPI()
app_test.include_router(auth.router)
app_test.include_router(configuracion.router)
app_test.include_router(seguridad.router)
app_test.include_router(medica.router)
app_test.include_router(salud_ext.router)
app_test.include_router(medicamentos.router)
app_test.include_router(bonificaciones.router)
app_test.include_router(exportaciones.router)
app_test.include_router(importaciones.router)

resources_map = {}

for route in app_test.routes:
    path = getattr(route, "path", None)
    methods = getattr(route, "methods", None)
    if not path or not methods:
        continue
    
    clean_methods = [m for m in methods if m not in ["HEAD", "OPTIONS"]]
    if not clean_methods:
        continue

    tags = getattr(route, "tags", [])
    tag_name = tags[0] if tags else "General"

    parts = [p for p in path.split("/") if p]
    is_item = False
    if parts and ("{" in parts[-1]):
        base_resource = "/" + "/".join(parts[:-1])
        is_item = True
    else:
        base_resource = "/" + "/".join(parts) if parts else "/"

    if tag_name not in resources_map:
        resources_map[tag_name] = {}

    if base_resource not in resources_map[tag_name]:
        resources_map[tag_name][base_resource] = {
            "GET": False, "GET_ID": False, "POST": False, "PUT": False, "DELETE": False
        }

    for m in clean_methods:
        if m == "GET" and not is_item:
            resources_map[tag_name][base_resource]["GET"] = True
        elif m == "GET" and is_item:
            resources_map[tag_name][base_resource]["GET_ID"] = True
        elif m == "POST":
            resources_map[tag_name][base_resource]["POST"] = True
        elif m == "PUT":
            resources_map[tag_name][base_resource]["PUT"] = True
        elif m == "DELETE":
            resources_map[tag_name][base_resource]["DELETE"] = True

print("============================================================================================================================")
print("                               INFORME DE AUDITORÍA ARQUITECTÓNICA REST - FARMAKD ERP                                       ")
print("============================================================================================================================")
print(f"{'MÓDULO / TAG':<22} | {'GET':<4} | {'GET ID':<6} | {'POST':<5} | {'PUT':<4} | {'DELETE':<6} | {'RUTA REAL':<40} | {'ESTADO REST'}")
print("-" * 124)

total_res = 0
cert_res = 0

for tag, resources in resources_map.items():
    for res_path, data in resources.items():
        total_res += 1
        get_st = "✔" if data["GET"] else "✘"
        get_id_st = "✔" if data["GET_ID"] else "✘"
        post_st = "✔" if data["POST"] else "✘"
        put_st = "✔" if data["PUT"] else "✘"
        del_st = "✔" if data["DELETE"] else "✘"
        
        is_full = data["GET"] and data["GET_ID"] and data["POST"] and data["PUT"] and data["DELETE"]
        if is_full:
            cert_res += 1
            status = "🟢 COMPLETO"
        else:
            status = "🟡 PARCIAL"

        print(f"{tag:<22} | {get_st:<4} | {get_id_st:<6} | {post_st:<5} | {put_st:<4} | {del_st:<6} | {res_path:<40} | {status}")

print("============================================================================================================================")
print(f"  RESULTADO MATRIZ ARQUITECTÓNICA: {cert_res}/{total_res} Recursos con Cobertura REST Total (100% de Rutas Verificadas)")
print("============================================================================================================================")
