import pytest
from datetime import date, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import HTTPException

from app.core.database import Base
from app.models.domain_models import Periodo
from app.models.gestion_medica_models import Monodroga, Medico, Afiliado
from app.models.salud_convenios_models import ObraSocial, Plan, Farmacia, Bonificacion
from app.schemas.receta_schemas import RecetaCreateRequest, RecetaDetalleInput
from app.services.receta_service import RecetaService

TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def db_session():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Pre-cargar maestros
    p = Periodo(codigo="2026-07", estado="ABIERTO", fecha_inicio=date(2026, 7, 1), fecha_fin=date(2026, 7, 31))
    p_cerr = Periodo(codigo="2026-06", estado="CERRADO", fecha_inicio=date(2026, 6, 1), fecha_fin=date(2026, 6, 30))
    os = ObraSocial(codigo="OSDE", razon_social="OSDE Binario", cuit="30546741251", activo=True)
    db.add_all([p, p_cerr, os])
    db.commit()

    pl = Plan(obra_social_id=os.id, nombre="Plan 210", cobertura_porcentaje_defecto=40.0, activo=True)
    far = Farmacia(codigo_cuit="30111111118", nombre="Farmacia Central", direccion="Calle 1", activa=True)
    med = Medico(matricula_nacional="MN100", apellido="Pérez", nombre="Juan", especialidad="Clínica", numero_documento="30000000", activo=True)
    med_inact = Medico(matricula_nacional="MN200", apellido="López", nombre="Ana", especialidad="Clínica", numero_documento="30000001", activo=False)
    afi = Afiliado(obra_social_id=os.id, plan_id=1, numero_afiliado="101", numero_documento="35000000", apellido="Sosa", nombre="Pedro", activo=True)
    mono = Monodroga(codigo="M01", descripcion="Ibuprofeno", activo=True)
    bonif = Bonificacion(obra_social_id=os.id, farmacia_id=1, porcentaje_bonificacion=10.0, fecha_vigencia_desde=date(2026, 1, 1), activa=True)

    db.add_all([pl, far, med, med_inact, afi, mono, bonif])
    db.commit()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_receta_valida_exitosa(db_session):
    req = RecetaCreateRequest(
        numero_receta="REC-0001",
        obra_social_id=1,
        farmacia_id=1,
        afiliado_id=1,
        medico_id=1,
        fecha_prescripcion=date(2026, 7, 10),
        fecha_dispensa=date(2026, 7, 15),
        detalles=[RecetaDetalleInput(monodroga_id=1, cantidad=2, pvp_unitario=5000.0)]
    )
    receta = RecetaService.validate_and_create_receta(db_session, req)
    assert receta.id is not None
    assert receta.total_pvp == 10000.0
    assert receta.total_cobertura_os == 4000.0  # 40%
    assert receta.monto_bonificado == 1000.0    # 10% de ,000

def test_receta_duplicada_fails(db_session):
    req = RecetaCreateRequest(
        numero_receta="REC-DUP",
        obra_social_id=1,
        farmacia_id=1,
        afiliado_id=1,
        medico_id=1,
        fecha_prescripcion=date(2026, 7, 10),
        fecha_dispensa=date(2026, 7, 15),
        detalles=[RecetaDetalleInput(monodroga_id=1, cantidad=1, pvp_unitario=1000.0)]
    )
    RecetaService.validate_and_create_receta(db_session, req)

    with pytest.raises(HTTPException) as exc:
        RecetaService.validate_and_create_receta(db_session, req)
    assert exc.value.status_code == 409

def test_receta_periodo_cerrado_fails(db_session):
    req = RecetaCreateRequest(
        numero_receta="REC-CERR",
        obra_social_id=1,
        farmacia_id=1,
        afiliado_id=1,
        medico_id=1,
        fecha_prescripcion=date(2026, 6, 10),
        fecha_dispensa=date(2026, 6, 15),  # Período Junio CERRADO
        detalles=[RecetaDetalleInput(monodroga_id=1, cantidad=1, pvp_unitario=1000.0)]
    )
    with pytest.raises(HTTPException) as exc:
        RecetaService.validate_and_create_receta(db_session, req)
    assert exc.value.status_code == 400

def test_receta_medico_inactivo_fails(db_session):
    req = RecetaCreateRequest(
        numero_receta="REC-MED-INACT",
        obra_social_id=1,
        farmacia_id=1,
        afiliado_id=1,
        medico_id=2,  # Médico inactivo
        fecha_prescripcion=date(2026, 7, 10),
        fecha_dispensa=date(2026, 7, 15),
        detalles=[RecetaDetalleInput(monodroga_id=1, cantidad=1, pvp_unitario=1000.0)]
    )
    with pytest.raises(HTTPException) as exc:
        RecetaService.validate_and_create_receta(db_session, req)
    assert exc.value.status_code == 400