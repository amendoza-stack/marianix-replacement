import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

ENDPOINTS = [
    # C.11 - SEGURIDAD
    ("Permisos Agrupados (RBAC)", "/api/v1/permisos"),
    ("Usuarios", "/api/v1/seguridad/usuarios"),
    ("Roles", "/api/v1/seguridad/roles"),

    # C.11 - CONFIGURACIÓN AUXILIAR
    ("Países", "/api/v1/config/paises"),
    ("Provincias", "/api/v1/config/provincias"),
    ("Ubicaciones", "/api/v1/config/ubicaciones"),
    ("Zonas", "/api/v1/config/zonas"),
    ("Colegios Farmacéuticos", "/api/v1/config/colegios-farmaceuticos"),
    ("Categorías Medicamentos", "/api/v1/config/categorias-medicamentos"),
    ("Tipos Patologías", "/api/v1/config/tipos-patologias"),
    ("Especialidades Médicas", "/api/v1/config/especialidades-medicas"),
    ("Observaciones", "/api/v1/config/observaciones"),
    ("Vínculos", "/api/v1/config/vinculos"),
    ("Períodos", "/api/v1/config/periodos"),
    ("Droguerías", "/api/v1/config/droguerias"),

    # C.11 - GESTIÓN MÉDICA
    ("Afiliados", "/api/v1/medica/afiliados"),
    ("Médicos", "/api/v1/medica/medicos"),

    # C.11 - GESTIÓN SALUD
    ("Obras Sociales", "/api/v1/salud/obras-sociales"),
    ("Planes", "/api/v1/salud/planes"),
    ("Farmacias OS", "/api/v1/salud/farmacias-os"),
    ("Laboratorios", "/api/v1/salud/laboratorios"),
    ("Farmacias", "/api/v1/salud/farmacias"),

    # C.11 - MEDICAMENTOS
    ("Drogas", "/api/v1/medicamentos/drogas"),
    ("Monodrogas", "/api/v1/medicamentos/monodrogas"),
    ("Potencias", "/api/v1/medicamentos/potencias"),
    ("Formas Farmacéuticas", "/api/v1/medicamentos/formas"),
    ("Vías de Administración", "/api/v1/medicamentos/vias"),
    ("Acciones Terapéuticas", "/api/v1/medicamentos/acciones"),
    ("Maestro Medicamentos", "/api/v1/medicamentos/maestro"),

    # C.11 - BONIFICACIONES
    ("Bonificaciones", "/api/v1/bonificaciones")
]

print("==========================================================================")
print("   SISTEMA FARMAKD - AUDITORÍA Y CERTIFICACIÓN TÉCNICA DE INTEGRIDAD     ")
print("==========================================================================")

exitos = 0
fallos = 0

for label, path in ENDPOINTS:
    url = f"{BASE_URL}{path}"
    try:
        req = urllib.request.Request(url, method="GET")
        req.add_header('Content-Type', 'application/json')
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            body = json.loads(resp.read().decode('utf-8'))
            items = len(body) if isinstance(body, list) else 1
            print(f"✅ [CERTIFICADO 200 OK] {label:<30} -> {path:<40} ({items} registros en DB)")
            exitos += 1
    except Exception as e:
        print(f"❌ [FALLO AUDITORÍA]     {label:<30} -> {path:<40} Error: {str(e)}")
        fallos += 1

print("==========================================================================")
print(f"RESULTADO: {exitos} Módulos Verificados Correctamente | {fallos} Inconsistencias")
print("==========================================================================")

if fallos > 0:
    sys.exit(1)
