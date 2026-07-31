import os
import sys

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from app.main import app
except Exception as e:
    print(f"❌ Error al cargar la aplicación FastAPI: {e}")
    sys.exit(1)

print("====================================================================================================")
print("             INFORME DE AUDITORÍA ARQUITECTÓNICA DE ROUTERS - FARMAKD ERP                           ")
print("====================================================================================================")

resources_map = {}

for route in app.routes:
    if hasattr(route, "path") and hasattr(route, "methods"):
        path = route.path
        methods = list(route.methods - {"HEAD", "OPTIONS"})
        
        if path in ["/openapi.json", "/docs", "/redoc", "/docs/oauth2-redirect", "/health", "/api/v1/health", "/api/v1/docs", "/api/v1/openapi.json"]:
            continue
            
        tags = getattr(route, "tags", ["General"])
        tag_name = tags[0] if tags else "General"
        
        # Agrupar recurso quitando el último segmento si es un parámetro dinámico
        parts = path.rstrip("/").split("/")
        is_item = False
        if "{" in parts[-1] and "}" in parts[-1]:
            base_resource = "/".join(parts[:-1])
            is_item = True
        else:
            base_resource = path if path != "" else "/"
            
        if tag_name not in resources_map:
            resources_map[tag_name] = {}
            
        if base_resource not in resources_map[tag_name]:
            resources_map[tag_name][base_resource] = {
                "GET": False, "GET_ID": False, "POST": False, "PUT": False, "DELETE": False
            }
            
        for m in methods:
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

print(f"{'MÓDULO / TAG':<22} | {'RECURSO BASE':<42} | {'GET':<4} | {'GET ID':<6} | {'POST':<5} | {'PUT':<4} | {'DELETE':<6} | {'ESTADO REST'}")
print("-" * 118)

for tag, resources in resources_map.items():
    for res_path, data in resources.items():
        get_st = "✅" if data["GET"] else "❌"
        get_id_st = "✅" if data["GET_ID"] else "❌"
        post_st = "✅" if data["POST"] else "❌"
        put_st = "✅" if data["PUT"] else "❌"
        del_st = "✅" if data["DELETE"] else "❌"
        
        is_full_rest = data["GET"] and data["GET_ID"] and data["POST"] and data["PUT"] and data["DELETE"]
        status = "🟢 COMPLETO" if is_full_rest else "🟡 PARCIAL"
        
        print(f"{tag:<22} | {res_path:<42} | {get_st:<4} | {get_id_st:<6} | {post_st:<5} | {put_st:<4} | {del_st:<6} | {status}")

print("====================================================================================================")
print("AUDITORÍA ARQUITECTÓNICA COMPLETADA EXITOSAMENTE")
print("====================================================================================================")
