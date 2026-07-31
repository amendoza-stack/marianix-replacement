import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def check_endpoint(method, path, body=None):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    data = json.dumps(body).encode('utf-8') if body else None
    
    start = time.time()
    try:
        with urllib.request.urlopen(req, data=data) as resp:
            elapsed = round((time.time() - start) * 1000, 2)
            res_body = json.loads(resp.read().decode('utf-8'))
            items = len(res_body) if isinstance(res_body, list) else 1
            return resp.status, items, elapsed
    except urllib.error.HTTPError as e:
        elapsed = round((time.time() - start) * 1000, 2)
        return e.code, 0, elapsed
    except Exception as e:
        return 500, 0, 0

modules_to_certify = [
    # SEGURIDAD
    ("Login (Superadmin)", "/api/v1/auth/login", "POST", {"username": "anamendoza", "clave": "Lafken26"}),
    ("Usuarios", "/api/v1/seguridad/usuarios", "GET", None),
    ("Roles", "/api/v1/seguridad/roles", "GET", None),
    ("Permisos (RBAC)", "/api/v1/permisos", "GET", None),

    # CONFIGURACIÓN
    ("Países", "/api/v1/config/paises", "GET", None),
    ("Provincias", "/api/v1/config/provincias", "GET", None),
    ("Ubicaciones", "/api/v1/config/ubicaciones", "GET", None),
    ("Zonas", "/api/v1/config/zonas", "GET", None),
    ("Colegios Farmacéuticos", "/api/v1/config/colegios-farmaceuticos", "GET", None),
    ("Categorías Medicamentos", "/api/v1/config/categorias-medicamentos", "GET", None),
    ("Tipos Patologías", "/api/v1/config/tipos-patologias", "GET", None),
    ("Especialidades Médicas", "/api/v1/config/especialidades-medicas", "GET", None),
    ("Observaciones", "/api/v1/config/observaciones", "GET", None),
    ("Vínculos", "/api/v1/config/vinculos", "GET", None),
    ("Períodos", "/api/v1/config/periodos", "GET", None),
    ("Droguerías", "/api/v1/config/droguerias", "GET", None),

    # GESTIÓN MÉDICA
    ("Afiliados", "/api/v1/medica/afiliados", "GET", None),
    ("Médicos", "/api/v1/medica/medicos", "GET", None),

    # GESTIÓN SALUD
    ("Obras Sociales", "/api/v1/salud/obras-sociales", "GET", None),
    ("Planes", "/api/v1/salud/planes", "GET", None),
    ("Farmacias OS", "/api/v1/salud/farmacias-os", "GET", None),
    ("Laboratorios", "/api/v1/salud/laboratorios", "GET", None),
    ("Farmacias", "/api/v1/salud/farmacias", "GET", None),

    # MEDICAMENTOS
    ("Drogas", "/api/v1/medicamentos/drogas", "GET", None),
    ("Monodrogas", "/api/v1/medicamentos/monodrogas", "GET", None),
    ("Potencias", "/api/v1/medicamentos/potencias", "GET", None),
    ("Formas Farmacéuticas", "/api/v1/medicamentos/formas", "GET", None),
    ("Vías de Administración", "/api/v1/medicamentos/vias", "GET", None),
    ("Acciones Terapéuticas", "/api/v1/medicamentos/acciones", "GET", None),
    ("Maestro Medicamentos", "/api/v1/medicamentos/maestro", "GET", None),

    # BONIFICACIONES
    ("Bonificaciones", "/api/v1/bonificaciones", "GET", None)
]

print("==========================================================================")
print("     AUDITORÍA Y CERTIFICACIÓN MAESTRA END-TO-END - FARMAKD ERP           ")
print("==========================================================================")

passed = 0
failed = 0

for label, path, method, payload in modules_to_certify:
    status, items, elapsed = check_endpoint(method, path, payload)
    if status in [200, 201]:
        print(f"✅ [{status} OK] {label:<28} -> {path:<38} | DB Items: {items:<3} | {elapsed}ms")
        passed += 1
    else:
        print(f"❌ [{status} ERR] {label:<28} -> {path:<38} | Falla en Certificación")
        failed += 1

print("==========================================================================")
print(f"RESULTADO: {passed} Módulos Aprobados | {failed} Inconsistencias Detectadas")
print("==========================================================================")
