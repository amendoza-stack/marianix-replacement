import urllib.request
import urllib.error
import json

BASE_URL = "http://127.0.0.1:8000"

def api_request(method, path, body=None):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    data = json.dumps(body).encode('utf-8') if body else None
    
    try:
        with urllib.request.urlopen(req, data=data) as resp:
            status = resp.status
            content = resp.read().decode('utf-8')
            res_body = json.loads(content) if content else {}
            return status, res_body
    except urllib.error.HTTPError as e:
        content = e.read().decode('utf-8')
        try:
            res_body = json.loads(content)
        except Exception:
            res_body = content
        return e.code, res_body
    except Exception as e:
        return 500, str(e)

TEST_MATRIX = [
    {"module": "Usuarios", "base_path": "/api/v1/seguridad/usuarios", "post_data": {"nombre": "User Test", "username": "user_test_crud", "email": "testcrud@farmakd.com", "activo": True}},
    {"module": "Roles", "base_path": "/api/v1/seguridad/roles", "post_data": {"nombre": "Rol Prueba", "descripcion": "Descripción Inicial"}},
    {"module": "Países", "base_path": "/api/v1/config/paises", "post_data": {"nombre": "País Test", "descripcion": "País Test", "codigoIso": "TC"}},
    {"module": "Provincias", "base_path": "/api/v1/config/provincias", "post_data": {"nombre": "Provincia Test", "descripcion": "Provincia Test", "paisId": 1}},
    {"module": "Ubicaciones", "base_path": "/api/v1/config/ubicaciones", "post_data": {"nombre": "Ubicación Test", "descripcion": "Ubicación Test"}},
    {"module": "Zonas", "base_path": "/api/v1/config/zonas", "post_data": {"nombre": "Zona Test", "descripcion": "Zona Test"}},
    {"module": "Colegios Farmacéuticos", "base_path": "/api/v1/config/colegios-farmaceuticos", "post_data": {"nombre": "Colegio Test", "descripcion": "Colegio Test"}},
    {"module": "Categorías Medicamentos", "base_path": "/api/v1/config/categorias-medicamentos", "post_data": {"nombre": "Categoría Test", "descripcion": "Categoría Test"}},
    {"module": "Tipos Patologías", "base_path": "/api/v1/config/tipos-patologias", "post_data": {"nombre": "Patología Test", "descripcion": "Patología Test"}},
    {"module": "Especialidades Médicas", "base_path": "/api/v1/config/especialidades-medicas", "post_data": {"nombre": "Especialidad Test", "descripcion": "Especialidad Test"}},
    {"module": "Observaciones", "base_path": "/api/v1/config/observaciones", "post_data": {"nombre": "Observación Test", "descripcion": "Observación Test"}},
    {"module": "Vínculos", "base_path": "/api/v1/config/vinculos", "post_data": {"nombre": "Vínculo Test", "descripcion": "Vínculo Test"}},
    {"module": "Períodos", "base_path": "/api/v1/config/periodos", "post_data": {"nombre": "Período Test", "descripcion": "Período Test"}},
    {"module": "Droguerías", "base_path": "/api/v1/config/droguerias", "post_data": {"nombre": "Droguería Test", "descripcion": "Droguería Test"}},
    {"module": "Afiliados", "base_path": "/api/v1/medica/afiliados", "post_data": {"nombre": "Afiliado Test", "descripcion": "Afiliado Test"}},
    {"module": "Médicos", "base_path": "/api/v1/medica/medicos", "post_data": {"nombre": "Médico Test", "descripcion": "Médico Test"}},
    {"module": "Obras Sociales", "base_path": "/api/v1/salud/obras-sociales", "post_data": {"nombre": "Obra Social Test", "descripcion": "Obra Social Test", "sigla": "OSTEST", "cuit": "30-22222222-9"}},
    {"module": "Planes", "base_path": "/api/v1/salud/planes", "post_data": {"nombre": "Plan Test", "descripcion": "Plan Test"}},
    {"module": "Farmacias OS", "base_path": "/api/v1/salud/farmacias-os", "post_data": {"nombre": "Farmacia OS Test", "descripcion": "Farmacia OS Test"}},
    {"module": "Laboratorios", "base_path": "/api/v1/salud/laboratorios", "post_data": {"nombre": "Laboratorio Test", "descripcion": "Laboratorio Test", "cuit": "30-33333333-9"}},
    {"module": "Farmacias", "base_path": "/api/v1/salud/farmacias", "post_data": {"nombre": "Farmacia Test", "descripcion": "Farmacia Test"}},
    {"module": "Drogas", "base_path": "/api/v1/medicamentos/drogas", "post_data": {"nombre": "Droga Test", "descripcion": "Droga Test"}},
    {"module": "Monodrogas", "base_path": "/api/v1/medicamentos/monodrogas", "post_data": {"nombre": "Monodroga Test", "descripcion": "Monodroga Test"}},
    {"module": "Potencias", "base_path": "/api/v1/medicamentos/potencias", "post_data": {"nombre": "Potencia Test", "descripcion": "Potencia Test"}},
    {"module": "Formas Farmacéuticas", "base_path": "/api/v1/medicamentos/formas", "post_data": {"nombre": "Forma Test", "descripcion": "Forma Test"}},
    {"module": "Vías de Administración", "base_path": "/api/v1/medicamentos/vias", "post_data": {"nombre": "Vía Test", "descripcion": "Vía Test"}},
    {"module": "Acciones Terapéuticas", "base_path": "/api/v1/medicamentos/acciones", "post_data": {"nombre": "Acción Test", "descripcion": "Acción Test"}},
    {"module": "Maestro Medicamentos", "base_path": "/api/v1/medicamentos/maestro", "post_data": {"nombre": "Medicamento Test", "descripcion": "Medicamento Test"}},
    {"module": "Bonificaciones", "base_path": "/api/v1/bonificaciones", "post_data": {"nombre": "Bonificación Test", "descripcion": "Bonificación Test", "porcentaje": 10.0}}
]

print("==========================================================================================")
print("     SUITE DE VALIDACIÓN TRANSACCIONAL CRUD COMPLETA - REPARADA Y VERIFICADA               ")
print("==========================================================================================")

passed = 0
failed = 0

for item in TEST_MATRIX:
    mod = item["module"]
    path = item["base_path"]
    post_payload = item["post_data"]
    put_payload = {**post_payload, "nombre": f"{mod} Modificado", "descripcion": f"{mod} Modificado"}
    
    # 1. POST
    status_post, res_post = api_request("POST", path, post_payload)
    if status_post not in [200, 201] or not isinstance(res_post, dict) or "id" not in res_post:
        print(f"❌ [{mod:<22}] -> POST Fail (HTTP {status_post}): {res_post}")
        failed += 1
        continue
    
    rec_id = res_post["id"]
    
    # 2. GET BY ID
    status_get, res_get = api_request("GET", f"{path}/{rec_id}")
    if status_get != 200:
        print(f"❌ [{mod:<22}] -> GET/ID Fail (HTTP {status_get})")
        failed += 1
        continue
        
    # 3. PUT
    status_put, res_put = api_request("PUT", f"{path}/{rec_id}", put_payload)
    if status_put != 200:
        print(f"❌ [{mod:<22}] -> PUT Fail (HTTP {status_put})")
        failed += 1
        continue
        
    # 4. DELETE
    status_del, res_del = api_request("DELETE", f"{path}/{rec_id}")
    if status_del not in [200, 204]:
        print(f"❌ [{mod:<22}] -> DELETE Fail (HTTP {status_del})")
        failed += 1
        continue

    print(f"✅ [{mod:<22}] -> CRUD Completo (POST, GET/ID, PUT, DELETE) OK | ID: {rec_id}")
    passed += 1

print("==========================================================================================")
print(f"  RESULTADO MATRIZ CRUD: {passed}/{len(TEST_MATRIX)} Módulos 100% Certificados Transaccionalmente")
print("==========================================================================================")
