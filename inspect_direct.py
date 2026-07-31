import os
import sys

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from app.main import app
except Exception as e:
    print(f"❌ Error al importar FastAPI: {e}")
    sys.exit(1)

print("====================================================================================================")
print("             INFORME DE AUDITORÍA ARQUITECTÓNICA DE ROUTERS (INSPECCIÓN DIRECTA)                    ")
print("====================================================================================================")

routes_info = {}

for route in app.routes:
    path = getattr(route, "path", "")
    methods = getattr(route, "methods", set())
    
    if not path or path in ["/openapi.json", "/docs", "/redoc", "/docs/oauth2-redirect", "/health", "/api/v1/health"]:
        continue
        
    methods_clean = [m for m in methods if m not in ["HEAD", "OPTIONS"]]
    if not methods_clean:
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

    if tag_name not in routes_info:
        routes_info[tag_name] = {}

    if base_resource not in routes_info[tag_name]:
        routes_info[tag_name][base_resource] = {
            "GET": False, "GET_ID": False, "POST": False, "PUT": False, "DELETE": False
        }

    for m in methods_clean:
        if m == "GET" and not is_item:
            routes_info[tag_name][base_resource]["GET"] = True
        elif m == "GET" and is_item:
            routes_info[tag_name][base_resource]["GET_ID"] = True
        elif m == "POST":
            routes_info[tag_name][base_resource]["POST"] = True
        elif m == "PUT":
            routes_info[tag_name][base_resource]["PUT"] = True
        elif m == "DELETE":
            routes_info[tag_name][base_resource]["DELETE"] = True

print(f"{'TAG / MÓDULO':<22} | {'RECURSO BASE':<42} | {'GET':<4} | {'GET ID':<6} | {'POST':<5} | {'PUT':<4} | {'DELETE':<6} | {'ESTADO REST'}")
print("-" * 118)

total = 0
complete = 0

for tag, resources in routes_info.items():
    for res_path, data in resources.items():
        total += 1
        get_st = "✅" if data["GET"] else "❌"
        get_id_st = "✅" if data["GET_ID"] else "❌"
        post_st = "✅" if data["POST"] else "❌"
        put_st = "✅" if data["PUT"] else "❌"
        del_st = "✅" if data["DELETE"] else "❌"
        
        is_full = data["GET"] and data["GET_ID"] and data["POST"] and data["PUT"] and data["DELETE"]
        if is_full:
            complete += 1
            status = "🟢 COMPLETO"
        else:
            status = "🟡 PARCIAL"

        print(f"{tag:<22} | {res_path:<42} | {get_st:<4} | {get_id_st:<6} | {post_st:<5} | {put_st:<4} | {del_st:<6} | {status}")

print("====================================================================================================")
print(f"AUDITORÍA COMPLETADA: {complete}/{total} Recursos con Cobertura REST Total")
print("====================================================================================================")
