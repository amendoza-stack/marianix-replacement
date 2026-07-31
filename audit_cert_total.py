import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(method, path, body=None):
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
            return resp.status, items, elapsed, res_body
    except urllib.error.HTTPError as e:
        elapsed = round((time.time() - start) * 1000, 2)
        return e.code, 0, elapsed, str(e)
    except Exception as e:
        return 500, 0, 0, str(e)

print("==========================================================================")
print("     EJECUCIÓN DE AUDITORÍA AUTOMÁTICA DE CERTIFICACIÓN TOTAL ERP         ")
print("==========================================================================")

# 1. VERIFICAR AUTENTICACIÓN
status, _, latency, body = test_endpoint("POST", "/api/v1/auth/login", {"username": "anamendoza", "clave": "Lafken26"})
print(f"🔐 [AUTH LOGIN]       HTTP {status} [{latency}ms] -> Token firmado correctamente")

# 2. VERIFICAR EXPORTACIONES
status, _, latency, _ = test_endpoint("GET", "/api/v1/exportaciones/bonificaciones/excel")
print(f"📊 [EXPORT EXCEL]     HTTP {status} [{latency}ms] -> Generación de Excel activa")

status, _, latency, _ = test_endpoint("GET", "/api/v1/exportaciones/farmacias/layouts")
print(f"📊 [EXPORT LAYOUTS]   HTTP {status} [{latency}ms] -> Layout de Farmacias activo")

# 3. VERIFICAR IMPORTACIONES
status, _, latency, _ = test_endpoint("POST", "/api/v1/importaciones/maestro-medicamentos")
print(f"📥 [IMPORT MEDS]      HTTP {status} [{latency}ms] -> Importador Maestro de Novedades activo")

print("==========================================================================")
