import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def call_api(name, path, method="GET", payload=None):
    url = f"{BASE_URL}{path}"
    print(f"\n🧪 [{method}] {name} -> {path}")
    try:
        req = urllib.request.Request(url, method=method)
        req.add_header('Content-Type', 'application/json')
        data_bytes = json.dumps(payload).encode('utf-8') if payload else None
        
        with urllib.request.urlopen(req, data=data_bytes) as response:
            status = response.status
            body_text = response.read().decode('utf-8')
            res = json.loads(body_text) if body_text else {}
            
            count_str = f"({len(res)} elementos)" if isinstance(res, list) else ""
            print(f"   ✅ [HTTP {status}] OK {count_str}")
            return res
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"   ❌ [HTTP {e.code}] Error: {error_body}")
        return None
    except Exception as e:
        print(f"   ❌ [FALLO CONEXION]: {str(e)}")
        return None

print("==========================================================================")
print("  SUITE DE AUDITORÍA INTEGRAL DE APIS REST - MARIANIX ERP FULL MATRIZ    ")
print("==========================================================================")

# 1. HEALTH CHECK & INFRA
call_api("Health Check", "/health")
call_api("OpenAPI Spec", "/api/v1/openapi.json")

# 2. SEGURIDAD & RBAC
call_api("GET Permisos Agrupados", "/api/v1/permisos")

# 3. GESTIÓN SALUD: OBRAS SOCIALES
post_os = {
    "descripcion": "OBRA SOCIAL AUDITORIA GENERAL",
    "sigla": "OSAG",
    "cuit": "30-11111111-9",
    "paisId": 1,
    "provinciaNombre": "BUENOS AIRES",
    "localidad": "CABA",
    "activo": True
}
res_os = call_api("POST Obra Social", "/api/v1/salud/obras-sociales", "POST", post_os)
call_api("GET Obras Sociales", "/api/v1/salud/obras-sociales")
if res_os and "id" in res_os:
    call_api("PUT Obra Social", f"/api/v1/salud/obras-sociales/{res_os['id']}", "PUT", {**post_os, "descripcion": "OBRA SOCIAL MODIFICADA"})

# 4. GESTIÓN SALUD: LABORATORIOS
post_lab = {
    "descripcion": "LABORATORIO AUDITORIA GENERAL",
    "cuit": "30-22222222-8",
    "gln": "7790002222222",
    "provinciaNombre": "CORDOBA",
    "localidad": "CORDOBA",
    "activo": True
}
res_lab = call_api("POST Laboratorio", "/api/v1/salud/laboratorios", "POST", post_lab)
call_api("GET Laboratorios", "/api/v1/salud/laboratorios")
if res_lab and "id" in res_lab:
    call_api("PUT Laboratorio", f"/api/v1/salud/laboratorios/{res_lab['id']}", "PUT", {**post_lab, "descripcion": "LABORATORIO MODIFICADO"})

print("\n==========================================================================")
print("  AUDITORÍA DE ENDPOINTS COMPLETADA                                      ")
print("==========================================================================")
