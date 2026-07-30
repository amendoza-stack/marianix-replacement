import os
import sys

# Agregar el directorio raíz del backend al path de Python
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.domain_models import ObraSocial, Plan
from app.models.gestion_medica_models import Droga, Monodroga, Medicamento, Medico, Afiliado

def run_seed():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        if db.query(ObraSocial).count() == 0:
            os = ObraSocial(codigo="OSDE", razon_social="OSDE Binario", cuit="30546741251", activo=True)
            db.add(os)
            db.commit()
            db.refresh(os)

            plan = Plan(obra_social_id=os.id, nombre="Plan 210", cobertura_porcentaje_defecto=40.0)
            db.add(plan)
            db.commit()
            db.refresh(plan)

            afiliado = Afiliado(
                obra_social_id=os.id, plan_id=plan.id,
                numero_afiliado="210-987654-01", numero_documento="35412890",
                apellido="Pérez", nombre="Juan Carlos", activo=True
            )
            db.add(afiliado)

        if db.query(Medico).count() == 0:
            medico = Medico(
                matricula_nacional="MN145890", matricula_provincial="MP88741",
                apellido="Gómez", nombre="María Laura", especialidad="Cardiología",
                numero_documento="28901456", activo=True
            )
            db.add(medico)

        if db.query(Droga).count() == 0:
            droga = Droga(codigo="DROG-001", nombre="Analgésico / Antiinflamatorio", activo=True)
            db.add(droga)
            db.commit()
            db.refresh(droga)

            mono = Monodroga(droga_id=droga.id, codigo="MONO-IBU", descripcion="Ibuprofeno", activo=True)
            db.add(mono)
            db.commit()
            db.refresh(mono)

            med = Medicamento(
                monodroga_id=mono.id, codigo_gtin="7791234567890",
                nombre_comercial="Ibufab 600", presentacion="Comprimidos x 20",
                pvp_actual=4800.50, requiere_receta=True, activo=True
            )
            db.add(med)

        db.commit()
        print("Seed completado exitosamente.")
    except Exception as e:
        db.rollback()
        print(f"Error en Seed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()