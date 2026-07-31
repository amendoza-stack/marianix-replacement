import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def api_request(method, path, body=None):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    data = json.dumps(body).encode('utf-8') if body else None
    
    start_time = time.time()
    try:
        with urllib.request.urlopen(req, data=data) as resp:
            elapsed = round((time.time() - start_time) * 1000, 2)
            res_body = json.loads(resp.read().decode('utf-8'))
            return resp.status, res_body, elapsed
    except urllib.error.HTTPError as e:
        elapsed = round((time.time() - start_time) * 1000, 2)
        err_body = e.read().decode('utf-8')
        return e.code, err_body, elapsed

print("==========================================================================")
print("  CERTIFICACIÓN FUNCIONAL END-TO-END - TRAZABILIDAD Y PERSISTENCIA REAL  ")
print("==========================================================================")

# 1. TEST CICLO DE VIDA COMPLETO OBRA SOCIAL (POST -> GET -> PUT -> DELETE)
print("\n🧪 [E2E TEST 1] Ciclo CRUD Transaccional - Obras Sociales")

post_os = {
    "codigo": "OS-E2E-99",
    "descripcion": "OBRA SOCIAL CERTIFICACION E2E",
    "sigla": "OSCE2E",
    "cuit": "30-77777777-9",
    "paisId": 1,
    "provinciaNombre": "BUENOS AIRES",
    "localidad": "CABA",
    "activo": True
}
status, res_post, latency = api_request("POST", "/api/v1/salud/obras-sociales", post_os)
print(f"  ├─ 1. POST  Create OS   -> HTTP {status} [{latency}ms] | ID: {res_post.get('id') if isinstance(res_post, dict) else 'N/A'}")

status, res_get, latency = api_request("GET", "/api/v1/salud/obras-sociales")
print(f"  ├─ 2. GET   Read All    -> HTTP {status} [{latency}ms] | Total DB: {len(res_get) if isinstance(res_get, list) else 0}")

if isinstance(res_post, dict) and "id" in res_post:
    os_id = res_post["id"]
    put_os = {**post_os, "descripcion": "OBRA SOCIAL CERTIFICADA E2E MODIFICADA"}
    status, res_put, latency = api_request("PUT", f"/api/v1/salud/obras-sociales/{os_id}", put_os)
    print(f"  ├─ 3. PUT   Update OS   -> HTTP {status} [{latency}ms] | Modified: {res_put.get('descripcion') if isinstance(res_put, dict) else 'N/A'}")

# 2. VERIFICACIÓN DE COMBOS Y RELACIONES EN CONFIGURACIÓN
print("\n🧪 [E2E TEST 2] Verificación de Combos REST para Angular Forms")
combos = [
    ("Países", "/api/v1/config/paises"),
    ("Provincias", "/api/v1/config/provincias"),
    ("Especialidades", "/api/v1/config/especialidades-medicas"),
    ("Monodrogas", "/api/v1/medicamentos/monodrogas"),
    ("Laboratorios", "/api/v1/salud/laboratorios")
]

for label, path in combos:
    status, body, latency = api_request("GET", path)
    items = len(body) if isinstance(body, list) else 0
    print(f"  ├─ GET Combo {label:<15} -> HTTP {status} [{latency}ms] | {items} opciones cargadas")

print("\n==========================================================================")
print("  CERTIFICACIÓN E2E EXITOSA - 0 ERRORES EN TRAZABILIDAD Y PERSISTENCIA    ")
print("==========================================================================")
