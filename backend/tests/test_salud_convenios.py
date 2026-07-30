import pytest
from app.services.bonificacion_service import BonificacionService
from app.schemas.salud_convenios_schemas import ObraSocialCreate, FarmaciaCreate

def test_calculo_monto_bonificado_exitoso():
    # Caso 1: PVP ,000 con 10% Bonificación
    res1 = BonificacionService.calcular_monto_bonificado(10000.0, 10.0)
    assert res1["monto_bonificado"] == 1000.0
    assert res1["monto_a_cobrar_farmacia"] == 9000.0

    # Caso 2: PVP ,800.50 con 15.5% Bonificación
    res2 = BonificacionService.calcular_monto_bonificado(4800.50, 15.5)
    # 4800.50 * 0.155 = 744.0775 -> Redondeo .08
    assert res2["monto_bonificado"] == 744.08
    assert res2["monto_a_cobrar_farmacia"] == 4056.42

def test_calculo_bonificacion_limites_invalidos():
    with pytest.raises(ValueError):
        BonificacionService.calcular_monto_bonificado(-100.0, 10.0)

    with pytest.raises(ValueError):
        BonificacionService.calcular_monto_bonificado(1000.0, 105.0)

def test_validaciones_cuit_cbu_pydantic():
    # CUIT Inválido (menos de 11 dígitos)
    with pytest.raises(ValueError):
        ObraSocialCreate(codigo="OS01", razon_social="Test OS", cuit="30123")

    # CBU Inválido (distinto de 22 dígitos)
    with pytest.raises(ValueError):
        FarmaciaCreate(codigo_cuit="30546741251", nombre="Farmacia Central", direccion="Av. Siempre Viva 123", cbu_pago="12345")