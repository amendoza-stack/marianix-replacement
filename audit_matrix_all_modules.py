import urllib.request
import urllib.error
import json

BASE_URL = "http://127.0.0.1:8000"

# Matriz completa de endpoints a auditar
ENDPOINTS = [
    # 1. SEGURIDAD
    ("GET Permisos Agrupados", "/api/v1/permisos", "GET", None),
    ("GET Usuarios", "/api/v1/seguridad/usuarios", "GET", None),
    ("GET Roles", "/api/v1/seguridad/roles", "GET", None),
    
    # 2. CONFIGURACIÓN AUXILIAR
    ("GET Países", "/api/v1/config/paises", "GET", None),
    ("GET Provincias", "/api/v1/config/provincias", "GET", None),
    ("GET Ubicaciones", "/api/v1/config/ubicaciones", "GET", None),
    ("GET Zonas", "/api/v1/config/zonas", "GET", None),
    ("GET Colegios Farmacéuticos", "/api/v1/config/colegios-farmaceuticos", "GET", None),
    ("GET Categorías Medicamentos", "/api/v1/config/categorias-medicamentos", "GET", None),
    ("GET Tipos Patologías", "/api/v1/config/tipos-patologias", "GET", None),
    ("GET Especialidades Médicas", "/api/v1/config/especialidades-medicas", "GET", None),
    ("GET Observaciones", "/api/v1/config/observaciones", "GET", None),
    ("GET Vínculos", "/api/v1/config/vinculos", "GET", None),
    ("GET Períodos", "/api/v1/config/periodos", "GET", None),
    ("GET Droguerías", "/api/v1/config/droguerias", "GET", None),

    # 3. GESTIÓN MÉDICA
    ("GET Afiliados", "/api/v1/medica/afiliados", "GET", None),
    ("GET Médicos", "/api/v1/medica/medicos", "GET", None),

    # 4. GESTIÓN SALUD
    ("GET Obras Sociales", "/api/v1/salud/obras-sociales", "GET", None),
    ("GET Planes", "/api/v1/salud/planes", "GET", None),
    ("GET Farmacias OS", "/api/v1/salud/farmacias-os", "GET", None),
    ("GET Laboratorios", "/api/v1/salud/laboratorios", "GET", None),
    ("GET Farmacias", "/api/v1/salud/farmacias", "GET", None),

    # 5. MEDICAMENTOS
    ("GET Drogas", "/api/v1/medicamentos/drogas", "GET", None),
    ("GET Monodrogas", "/api/v1/medicamentos/monodrogas", "GET", None),
    ("GET Potencias", "/api/v1/medicamentos/potencias", "GET", None),
    ("GET Formas Farmacéuticas", "/api/v1/medicamentos/formas", "GET", None),
    ("GET Vías de Administración", "/api/v1/medicamentos/vias", "GET", None),
    ("GET Acciones Terapeuticas", "/api/v1/medicamentos/acciones", "GET", None),
    ("GET Maestro Medicamentos", "/api/v1/medicamentos/maestro", "GET", None),

    # 6. BONIFICACIONES
    ("GET Bonificaciones", "/api/v1/bonificaciones", "GET", None),
]

print("==========================================================================")
print("  SUITE DE AUDITORÍA FULL MATRIX - VERIFICACIÓN DE TODOS LOS ENDPOINTS    ")
print("==========================================================================")

exitos = 0
fallos = 0

for name, path, method, payload in ENDPOINTS:
    url = f"{BASE_URL}{path}"
    try:
        req = urllib.request.Request(url, method=method)
        req.add_header('Content-Type', 'application/json')
        
        with urllib.request.urlopen(req) as response:
            status = response.status
            body_text = response.read().decode('utf-8')
            res = json.loads(body_text) if body_text else []
            count = len(res) if isinstance(res, list) else 1
            print(f"✅ [HTTP {status}] {name:<32} -> {path:<40} ({count} items)")
            exitos += 1
    except urllib.error.HTTPError as e:
        print(f"❌ [HTTP {e.code}] {name:<32} -> {path:<40} (FAIL)")
        fallos += 1
    except Exception as e:
        print(f"⚠️ [SIN CONEXION] {name:<28} -> {path:<40} ({str(e)})")
        fallos += 1

print("\n==========================================================================")
print(f"  RESULTADO FINAL: {exitos} Endpoints Exitosos | {fallos} Endpoints Fallidos")
print("==========================================================================")
