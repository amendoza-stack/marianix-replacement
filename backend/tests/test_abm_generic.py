import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.models.domain_models import Pais
from app.repositories.base_repository import BaseRepository
from app.services.base_service import BaseService
from app.schemas.domain_schemas import PaisCreate, PaisUpdate

TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def db_session():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_generic_abm_crud_flow(db_session):
    repo = BaseRepository(Pais)
    service = BaseService(repo)

    # 1. CREATE
    pais_in = PaisCreate(nombre="Argentina", codigo_iso="ARG")
    nuevo_pais = service.create(db_session, pais_in)
    assert nuevo_pais.id is not None
    assert nuevo_pais.nombre == "Argentina"
    assert nuevo_pais.activo is True

    # 2. GET BY ID
    pais_db = service.get(db_session, nuevo_pais.id)
    assert pais_db.codigo_iso == "ARG"

    # 3. PAGINATED SEARCH
    service.create(db_session, PaisCreate(nombre="Brasil", codigo_iso="BRA"))
    service.create(db_session, PaisCreate(nombre="Uruguay", codigo_iso="URY"))

    res_search = service.get_paginated(
        db_session, page=1, size=10, search="Argen", search_fields=["nombre", "codigo_iso"]
    )
    assert res_search["total"] == 1
    assert res_search["items"][0].nombre == "Argentina"

    # 4. UPDATE
    update_in = PaisUpdate(nombre="República Argentina")
    pais_updated = service.update(db_session, nuevo_pais.id, update_in)
    assert pais_updated.nombre == "República Argentina"

    # 5. SOFT DELETE
    deleted = service.delete(db_session, nuevo_pais.id, soft_delete=True)
    assert deleted.activo is False

    # Verificar que only_active=True lo filtra
    active_only = service.get_paginated(db_session, page=1, size=10, only_active=True)
    assert active_only["total"] == 2