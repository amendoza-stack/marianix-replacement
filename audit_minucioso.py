import os
import sys
import re

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

routes_data = {}

for route in app.routes:
    path = getattr(route, "path", None)
    methods = getattr(route, "methods", None)

    if not path or not methods:
        continue

    clean_methods = [m for m in methods if m not in ["HEAD", "OPTIONS"]]
    if not clean_methods:
        continue

    # Ignorar rutas internas de OpenAPI/Docs
    if path in ["/openapi.json", "/docs", "/redoc", "/docs/oauth2-redirect", "/health", "/api/v1/health", "/api/v1/docs", "/api/v1/openapi.json"]:
        continue

    # Normalizar ruta: reemplaza cualquier {param} por {id}
    normalized_path = re.sub(r"\{[^}]+\}", "{id}", path)
    
    # Determinar si es una ruta sobre un item individual (termina en /{id})
    is_item_path = normalized_path.endswith("/{id}")
    
    # Recurso Base (sin el /{id})
    base_resource = normalized_path[:-5] if is_item_path else normalized_path

    tags = getattr(route, "tags", [])
    tag_name = tags[0] if tags else "General"

    if base_resource not in routes_data:
        routes_data[base_resource] = {
            "tag": tag_name,
            "GET": False,
            "GET_ID": False,
            "POST": False,
            "PUT": False,
            "DELETE": False
        }

    for m in clean_methods:
        if m == "GET" and not is_item_path:
            routes_data[base_resource]["GET"] = True
        elif m == "GET" and is_item_path:
            routes_data[base_resource]["GET_ID"] = True
        elif m == "POST":
            routes_data[base_resource]["POST"] = True
        elif m == "PUT":
            routes_data[base_resource]["PUT"] = True
        elif m == "DELETE":
            routes_data[base_resource]["DELETE"] = True

print("============================================================================================================================")
print("                               INFORME DE AUDITORÍA ARQUITECTÓNICA MINUCIOSA - FARMAKD ERP                                  ")
print("============================================================================================================================")
print(f"{'MÓDULO / TAG':<22} | {'GET':<4} | {'GET ID':<6} | {'POST':<5} | {'PUT':<4} | {'DELETE':<6} | {'RUTA REAL BASE':<40} | {'ESTADO REST'}")
print("-" * 124)

total_res = 0
complete_res = 0

for base_path, data in sorted(routes_data.items(), key=lambda x: x[1]["tag"]):
    total_res += 1
    get_st = "✔" if data["GET"] else "✘"
    get_id_st = "✔" if data["GET_ID"] else "✘"
    post_st = "✔" if data["POST"] else "✘"
    put_st = "✔" if data["PUT"] else "✘"
    del_st = "✔" if data["DELETE"] else "✘"

    is_full = data["GET"] and data["GET_ID"] and data["POST"] and data["PUT"] and data["DELETE"]
    if is_full:
        complete_res += 1
        status = "🟢 COMPLETO"
    else:
        status = "🟡 PARCIAL"

    print(f"{data['tag']:<22} | {get_st:<4} | {get_id_st:<6} | {post_st:<5} | {put_st:<4} | {del_st:<6} | {base_path:<40} | {status}")

print("============================================================================================================================")
print(f"  RESULTADO AUDITORÍA: {complete_res}/{total_res} Recursos con Cobertura REST Total")
print("============================================================================================================================")
