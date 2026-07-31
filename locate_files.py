import os

root_dir = r"C:\Users\aname\marianix-replacement"

print("==========================================================================================")
print("             RASTREO FÍSICO DE ARCHIVOS PYTHON Y ROUTERS EN EL REPOSITORIO                ")
print("==========================================================================================")

for dirpath, dirnames, filenames in os.walk(root_dir):
    # Omitir entornos virtuales y git
    if "venv" in dirpath or ".git" in dirpath or "__pycache__" in dirpath:
        continue
    for f in filenames:
        if f.endswith(".py"):
            full_path = os.path.join(dirpath, f)
            rel_path = os.path.relpath(full_path, root_dir)
            if any(x in f for x in ["main", "config", "seguridad", "medica", "salud", "medicamentos", "auth", "router"]):
                print(f"📄 {rel_path}")

print("==========================================================================================")
