import os
import sys

root_dir = r"C:\Users\aname\marianix-replacement"
backend_dir = os.path.join(root_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

modules_to_test = [
    ("Usuarios", "/api/v1/seguridad/usuarios", {"nombre": "Usuario Test", "email": "test@test.com"}),
    ("Roles", "/api/v1/seguridad/roles", {"nombre": "Rol Test"}),
    ("Países", "/api/v1/config/paises", {"nombre": "País Test"}),
    ("Provincias", "/api/v1/config/provincias", {"nombre": "Provincia Test"}),
    ("Ubicaciones", "/api/v1/config/ubicaciones", {"nombre": "Ubicación Test"}),
    ("Zonas", "/api/v1/config/zonas", {"nombre": "Zona Test"}),
    ("Colegios Farmacéuticos", "/api/v1/config/colegios-farmaceuticos", {"nombre": "Colegio Test"}),
    ("Categorías Medicamentos", "/api/v1/config/categorias-medicamentos", {"nombre": "Categoría Test"}),
    ("Tipos Patologías", "/api/v1/config/tipos-patologias", {"nombre": "Patología Test"}),
    ("Especialidades Médicas", "/api/v1/config/especialidades-medicas", {"nombre": "Especialidad Test"}),
    ("Observaciones", "/api/v1/config/observaciones", {"nombre": "Observación Test"}),
    ("Vínculos", "/api/v1/config/vinculos", {"nombre": "Vínculo Test"}),
    ("Períodos", "/api/v1/config/periodos", {"nombre": "Período Test"}),
    ("Droguerías", "/api/v1/config/droguerias", {"nombre": "Droguería Test"}),
    ("Afiliados", "/api/v1/medica/afiliados", {"nombre": "Afiliado Test"}),
    ("Médicos", "/api/v1/medica/medicos", {"nombre": "Médico Test"}),
    ("Obras Sociales", "/api/v1/salud/obras-sociales", {"nombre": "Obra Social Test"}),
    ("Planes", "/api/v1/salud/planes", {"nombre": "Plan Test"}),
    ("Farmacias OS", "/api/v1/salud/farmacias-os", {"nombre": "Farmacia OS Test"}),
    ("Laboratorios", "/api/v1/salud/laboratorios", {"nombre": "Laboratorio Test"}),
    ("Farmacias", "/api/v1/salud/farmacias", {"nombre": "Farmacia Test"}),
    ("Drogas", "/api/v1/medicamentos/drogas", {"nombre": "Droga Test"}),
    ("Monodrogas", "/api/v1/medicamentos/monodrogas", {"nombre": "Monodroga Test"}),
    ("Potencias", "/api/v1/medicamentos/potencias", {"nombre": "Potencia Test"}),
    ("Formas Farmacéuticas", "/api/v1/medicamentos/formas", {"nombre": "Forma Test"}),
    ("Vías de Administración", "/api/v1/medicamentos/vias", {"nombre": "Vía Test"}),
    ("Acciones Terapéuticas", "/api/v1/medicamentos/acciones", {"nombre": "Acción Test"}),
    ("Maestro Medicamentos", "/api/v1/medicamentos/maestro", {"nombre": "Medicamento Test"}),
    ("Bonificaciones", "/api/v1/bonificaciones", {"nombre": "Bonificación Test"})
]

print("==========================================================================================")
print("       SUITE DE INTEGRACIÓN Y VALIDACIÓN TRANSACCIONAL CRUD COMPLETA (TEST CLIENT)        ")
print("==========================================================================================")

success_count = 0
total_count = len(modules_to_test)

for name, endpoint, payload in modules_to_test:
    try:
        # 1. POST (Create)
        res_post = client.post(endpoint, json=payload)
        if res_post.status_code not in [200, 201]:
            print(f"❌ [{name:<22}] -> POST Fail (HTTP {res_post.status_code}): {res_post.text}")
            continue

        created_item = res_post.json()
        item_id = created_item.get("id", 1)

        # 2. GET List
        res_get = client.get(endpoint)
        if res_get.status_code != 200:
            print(f"❌ [{name:<22}] -> GET List Fail (HTTP {res_get.status_code})")
            continue

        # 3. GET ID
        res_get_id = client.get(f"{endpoint}/{item_id}")
        if res_get_id.status_code != 200:
            print(f"❌ [{name:<22}] -> GET ID Fail (HTTP {res_get_id.status_code})")
            continue

        # 4. PUT (Update)
        res_put = client.put(f"{endpoint}/{item_id}", json={**payload, "nombre": f"{payload['nombre']} Updated"})
        if res_put.status_code != 200:
            print(f"❌ [{name:<22}] -> PUT Fail (HTTP {res_put.status_code})")
            continue

        # 5. DELETE
        res_del = client.delete(f"{endpoint}/{item_id}")
        if res_del.status_code != 200:
            print(f"❌ [{name:<22}] -> DELETE Fail (HTTP {res_del.status_code})")
            continue

        print(f"🟢 [{name:<22}] -> CRUD COMPLETO OK (POST, GET, GET_ID, PUT, DELETE)")
        success_count += 1

    except Exception as e:
        print(f"💥 [{name:<22}] -> Excepción durante ejecución: {e}")

print("==========================================================================================")
print(f" RESULTADO PRUEBA INTEGRAL: {success_count}/{total_count} MÓDULOS PASARON VERIFICACIÓN CRUD TOTAL")
print("==========================================================================================")
