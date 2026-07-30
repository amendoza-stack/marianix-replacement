from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple, Optional

class ImportStrategy(ABC):
    @abstractmethod
    def validate_header(self, header_line: str) -> bool:
        """Valida si la primera línea cumple con el encabezado esperado."""
        pass

    @abstractmethod
    def parse_line(self, line: str, line_num: int) -> Tuple[bool, Dict[str, Any], Optional[str]]:
        """Mapea una línea de texto a un diccionario de campos parseados."""
        pass

class PipeDelimitedLayoutStrategy(ImportStrategy):
    """
    Formato Delimitado por Pipes (|):
    NUMERO_RECETA|OBRA_SOCIAL_ID|FARMACIA_ID|AFILIADO_ID|MEDICO_ID|FECHA_PRESCRIPCION|FECHA_DISPENSA|MONODROGA_ID|CANTIDAD|PVP_UNITARIO
    """
    EXPECTED_HEADER = "NUMERO_RECETA|OBRA_SOCIAL_ID|FARMACIA_ID|AFILIADO_ID|MEDICO_ID|FECHA_PRESCRIPCION|FECHA_DISPENSA|MONODROGA_ID|CANTIDAD|PVP_UNITARIO"

    def validate_header(self, header_line: str) -> bool:
        return header_line.strip().upper() == self.EXPECTED_HEADER

    def parse_line(self, line: str, line_num: int) -> Tuple[bool, Dict[str, Any], Optional[str]]:
        parts = [p.strip() for p in line.strip().split("|")]
        if len(parts) != 10:
            return False, {}, f"Línea {line_num}: Cantidad de columnas inválida. Se esperaban 10 y se recibieron {len(parts)}."

        try:
            parsed = {
                "numero_receta": parts[0],
                "obra_social_id": int(parts[1]),
                "farmacia_id": int(parts[2]),
                "afiliado_id": int(parts[3]),
                "medico_id": int(parts[4]),
                "fecha_prescripcion": parts[5],
                "fecha_dispensa": parts[6],
                "monodroga_id": int(parts[7]),
                "cantidad": int(parts[8]),
                "pvp_unitario": float(parts[9])
            }
            return True, parsed, None
        except ValueError as e:
            return False, {}, f"Línea {line_num}: Error de tipo de datos al parsear ({str(e)})."