import os
import sys
import traceback

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

print("==========================================================================================")
print("             DIAGNÓSTICO EXPLICITO DE IMPORTACIÓN DE APP.MAIN                             ")
print("==========================================================================================")

try:
    print("1. Intentando importar app.main...")
    import app.main
    print("✅ app.main importado con éxito.")
    
    app_instance = getattr(app.main, "app", None)
    if app_instance is None:
        print("❌ ERROR: El archivo app/main.py no define la variable 'app'")
    else:
        print(f"✅ Objeto FastAPI 'app' detectado. Cantidad de rutas brutas: {len(app_instance.routes)}")
        for r in app_instance.routes:
            path = getattr(r, "path", str(r))
            methods = getattr(r, "methods", set())
            print(f"   -> Path: {path} | Methods: {methods}")

except Exception as e:
    print("\n💥 SE PRODUJO UNA EXCEPCIÓN AL IMPORTAR APP.MAIN:")
    print("-" * 80)
    traceback.print_exc()
    print("-" * 80)

print("==========================================================================================")
