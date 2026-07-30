import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.core.audit_listener import register_audit_listeners
from app.core.audit_context import set_audit_context
from app.models.domain_models import Monodroga, AuditoriaLog

TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def test_db():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    register_audit_listeners()
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_automatic_audit_log_on_insert_and_update(test_db):
    set_audit_context(user_id=1, ip_address="192.168.1.50")

    # 1. INSERT
    nueva_monodroga = Monodroga(codigo="MONO-TEST-999", descripcion="Ibuprofeno 600mg")
    test_db.add(nueva_monodroga)
    test_db.commit()

    log_insert = test_db.query(AuditoriaLog).filter_by(tabla_afectada="monodroga", operacion="INSERT").first()
    assert log_insert is not None
    assert log_insert.usuario_id == 1
    assert log_insert.ip_origen == "192.168.1.50"
    assert "Ibuprofeno 600mg" in log_insert.valor_nuevo

    # Refrescar la entidad para salir del estado expired post-commit
    test_db.refresh(nueva_monodroga)

    # 2. UPDATE
    nueva_monodroga.descripcion = "Ibuprofeno 800mg Granulado"
    test_db.commit()

    log_update = test_db.query(AuditoriaLog).filter_by(tabla_afectada="monodroga", operacion="UPDATE").first()
    assert log_update is not None
    assert "Ibuprofeno 600mg" in log_update.valor_anterior
    assert "Ibuprofeno 800mg Granulado" in log_update.valor_nuevo