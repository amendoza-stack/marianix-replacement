import os
import pytest
from app.services.report_generators import ReportGenerators

@pytest.fixture
def sample_recetas_data():
    return [
        {
            "numero_receta": "REC-9901",
            "fecha_dispensa": "2026-07-15",
            "farmacia_nombre": "Farmacia Central",
            "farmacia_cuit": "30111111118",
            "afiliado_dni": "35000000",
            "medico_nombre": "Pérez Juan",
            "total_pvp": 10000.0,
            "total_cobertura_os": 4000.0,
            "monto_bonificado": 1000.0
        }
    ]

def test_generacion_reporte_331_txt(sample_recetas_data, tmp_path):
    output_file = os.path.join(tmp_path, "reporte_331.txt")
    ReportGenerators.generate_reporte_331_txt(sample_recetas_data, output_file)
    assert os.path.exists(output_file)
    with open(output_file, "r", encoding="utf-8") as f:
        content = f.read()
        assert "331|30111111118|REC-9901" in content

def test_generacion_excel(sample_recetas_data, tmp_path):
    output_file = os.path.join(tmp_path, "reporte.xlsx")
    ReportGenerators.generate_excel_report(sample_recetas_data, output_file)
    assert os.path.exists(output_file)

def test_generacion_pdf(sample_recetas_data, tmp_path):
    output_file = os.path.join(tmp_path, "reporte.pdf")
    ReportGenerators.generate_pdf_report(sample_recetas_data, output_file)
    assert os.path.exists(output_file)