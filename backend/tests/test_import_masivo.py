import pytest
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.models.domain_models import Periodo
from app.models.gestion_medica_models import Monodroga, Medico, Afiliado
from app.models.salud_convenios_models import ObraSocial, Plan, Farmacia
from app.services.import_service import ImportBatchService

TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def db_session():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    p = Periodo(codigo="2026-07", estado="ABIERTO", fecha_inicio=date(2026, 7, 1), fecha_fin=date(2026, 7, 31))
    os = ObraSocial(codigo="OSDE", razon_social="OSDE", cuit="30546741251", activo=True)
    db.add_all([p, os])
    db.commit()

    pl = Plan(obra_social_id=os.id, nombre="Plan 210", cobertura_porcentaje_defecto=40.0, activo=True)
    far = Farmacia(codigo_cuit="30111111118", nombre="Farmacia Central", direccion="Calle 1", activa=True)
    med = Medico(matricula_nacional="MN100", apellido="Pérez", nombre="Juan", especialidad="Clínica", numero_documento="30000000", activo=True)
    afi = Afiliado(obra_social_id=os.id, plan_id=1, numero_afiliado="101", numero_documento="35000000", apellido="Sosa", nombre="Pedro", activo=True)
    mono = Monodroga(codigo="M01", descripcion="Ibuprofeno", activo=True)

    db.add_all([pl, far, med, afi, mono])
    db.commit()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_importacion_masiva_txt_exitosa_y_rechazos(db_session):
    content = """NUMERO_RECETA|OBRA_SOCIAL_ID|FARMACIA_ID|AFILIADO_ID|MEDICO_ID|FECHA_PRESCRIPCION|FECHA_DISPENSA|MONODROGA_ID|CANTIDAD|PVP_UNITARIO
REC-BATCH-01|1|1|1|1|2026-07-10|2026-07-15|1|2|5000.0
REC-BATCH-02|1|1|99|1|2026-07-10|2026-07-15|1|1|1000.0"""

    import_log = ImportBatchService.process_txt_import(db_session, content=content, filename="test.txt")
    assert import_log.total_lineas == 2
    assert import_log.procesadas == 1
    assert import_log.rechazadas == 1