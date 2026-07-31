import urllib.request
import json

# Intentamos conectar a 127.0.0.1:8000
base_url = "http://127.0.0.1:8000"

def test_endpoint(name, url, method="GET", payload=None):
    print(f"🧪 Probando {name} [{method} {url}]...")
    try:
        req = urllib.request.Request(f"{base_url}{url}", method=method)
        req.add_header('Content-Type', 'application/json')
        data_bytes = json.dumps(payload).encode('utf-8') if payload else None
        
        with urllib.request.urlopen(req, data=data_bytes) as response:
            status = response.status
            res_body = json.loads(response.read().decode('utf-8'))
            print(f"   ✅ [HTTP {status}] Éxito. Respuesta: {res_body if isinstance(res_body, dict) else len(res_body)} elementos.")
            return True
    except Exception as e:
        print(f"   ❌ [FALLO] Error en {name}: {str(e)}")
        return False

print("=========================================================")
print("  SUITE DE AUDITORÍA AUTOMÁTICA EN VIVO - MARIANIX API  ")
print("=========================================================")

# 1. Health Check
test_endpoint("Health Check", "/health")

# 2. CRUD Obras Sociales
post_os = {
    "descripcion": "OBRA SOCIAL AUDITADA TEST",
    "sigla": "OSAT",
    "cuit": "30-99999999-9",
    "paisId": 1,
    "provinciaNombre": "BUENOS AIRES",
    "localidad": "CABA",
    "activo": True
}
test_endpoint("POST Obras Sociales", "/api/v1/salud/obras-sociales", method="POST", payload=post_os)
test_endpoint("GET Obras Sociales", "/api/v1/salud/obras-sociales")

# 3. CRUD Laboratorios
post_lab = {
    "descripcion": "LABORATORIO DE PRUEBA AUDITORIA",
    "cuit": "30-88888888-8",
    "gln": "7790008888888",
    "provinciaNombre": "CORDOBA",
    "localidad": "CORDOBA",
    "activo": True
}
test_endpoint("POST Laboratorios", "/api/v1/salud/laboratorios", method="POST", payload=post_lab)
test_endpoint("GET Laboratorios", "/api/v1/salud/laboratorios")

print("=========================================================")
