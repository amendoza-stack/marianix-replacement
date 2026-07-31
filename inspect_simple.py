import os
import sys

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

print("==========================================================================================")
print("             INSPECCIÓN REAL DE RUTAS EN MEMORIA (FASTAPI APP)                            ")
print("==========================================================================================")

total_routes = 0
for route in app.routes:
    path = getattr(route, "path", None)
    methods = getattr(route, "methods", None)
    if path and methods:
        clean_methods = [m for m in methods if m not in ["HEAD", "OPTIONS"]]
        if clean_methods:
            total_routes += 1
            print(f"{clean_methods[0]:<7} -> {path}")

print("==========================================================================================")
print(f" TOTAL DE ENDPOINTS REGISTRADOS EN FASTAPI: {total_routes}")
print("==========================================================================================")
