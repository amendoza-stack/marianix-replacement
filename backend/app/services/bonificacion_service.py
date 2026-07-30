from decimal import Decimal, ROUND_HALF_UP

class BonificacionService:
    @staticmethod
    def calcular_monto_bonificado(pvp_total: float, porcentaje_bonificacion: float) -> dict:
        """
        Fórmula del DFD:
        Monto Bonificado = PVP Total * (% Bonificación / 100)
        """
        if pvp_total < 0:
            raise ValueError("El PVP Total no puede ser negativo.")
        if not (0 <= porcentaje_bonificacion <= 100):
            raise ValueError("El porcentaje de bonificación debe estar entre 0% y 100%.")

        dec_pvp = Decimal(str(pvp_total))
        dec_porcentaje = Decimal(str(porcentaje_bonificacion))

        monto_bonificado = (dec_pvp * (dec_porcentaje / Decimal("100"))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        monto_a_cobrar = (dec_pvp - monto_bonificado).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        return {
            "pvp_total": float(dec_pvp),
            "porcentaje_bonificacion": float(dec_porcentaje),
            "monto_bonificado": float(monto_bonificado),
            "monto_a_cobrar_farmacia": float(monto_a_cobrar)
        }