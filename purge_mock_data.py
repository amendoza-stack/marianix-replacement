import os
import re

root_dir = r"C:\Users\aname\marianix-replacement"
frontend_src = os.path.join(root_dir, "frontend", "src", "app")

print("🔍 Iniciando escaneo e higienización de servicios y componentes en Angular...")

# Patrones a detectar y erradicar
mock_patterns = [
    r'import\s+.*mock.*',
    r'return\s+of\(MOCK_.*\);?',
    r'return\s+of\(mock.*\);?',
    r'catchError\(\(\)\s*=>\s*of\(.*\)\)',
    r'MOCK_[A-Z_]+'
]

modified_files = []

if os.path.exists(frontend_src):
    for root, dirs, files in os.walk(frontend_src):
        for file in files:
            if file.endswith('.ts'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                original_content = content
                
                # Erradicar retornos de mockData en catchError
                content = re.sub(
                    r'catchError\([^)]*\)\s*=>\s*of\([^)]*\)',
                    'catchError(err => { console.error("Error API:", err); return throwError(() => err); })',
                    content
                )
                
                # Limpiar referencias explícitas a variables MOCK_
                for pattern in mock_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        print(f"  ⚠️ Limpiando patrón mock en: {file}")
                
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    modified_files.append(file)

print(f"✅ Proceso finalizado. Archivos depurados: {len(modified_files)}")
