from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.schemas.receta_schemas import RecetaCreateRequest
from app.models.domain_models import Receta, RecetaDetalle, Periodo
from app.models.gestion_medica_models import Afiliado, Medico, Monodroga
from app.models.salud_convenios_models import ObraSocial, Plan, PlanMonodroga, Farmacia, Bonificacion

class RecetaService:
    @staticmethod
    def validate_and_create_receta(db: Session, req: RecetaCreateRequest) -> Receta:
        # -------------------------------------------------------------
        # RN-05: Duplicidad de Receta
        # -------------------------------------------------------------
        existe_receta = db.query(Receta).filter(
            and_(Receta.numero_receta == req.numero_receta, Receta.obra_social_id == req.obra_social_id)
        ).first()
        if existe_receta:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"RN-05: Ya existe una receta registrada con el número '{req.numero_receta}' para la Obra Social ID {req.obra_social_id}."
            )

        # -------------------------------------------------------------
        # RN-01: Período Abierto para la fecha de dispensa
        # -------------------------------------------------------------
        periodo = db.query(Periodo).filter(
            and_(
                Periodo.fecha_inicio <= req.fecha_dispensa,
                Periodo.fecha_fin >= req.fecha_dispensa,
                Periodo.estado == "ABIERTO"
            )
        ).first()
        if not periodo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"RN-01: No existe un período abierto que cubra la fecha de dispensa {req.fecha_dispensa}."
            )

        # -------------------------------------------------------------
        # RN-02: Afiliado Existente y Activo
        # -------------------------------------------------------------
        afiliado = db.query(Afiliado).filter(Afiliado.id == req.afiliado_id).first()
        if not afiliado or not afiliado.activo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"RN-02: El Afiliado ID {req.afiliado_id} no existe o no se encuentra activo."
            )

        # -------------------------------------------------------------
        # RN-03: Médico Existente y Activo
        # -------------------------------------------------------------
        medico = db.query(Medico).filter(Medico.id == req.medico_id).first()
        if not medico or not medico.activo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"RN-03: El Médico ID {req.medico_id} no existe o no se encuentra activo."
            )

        # Validar Farmacia
        farmacia = db.query(Farmacia).filter(Farmacia.id == req.farmacia_id).first()
        if not farmacia or not farmacia.activa:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"La Farmacia ID {req.farmacia_id} no existe o no está activa."
            )

        # Validar Obra Social y Plan
        plan = db.query(Plan).filter(Plan.id == afiliado.plan_id).first()
        if not plan or not plan.activo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El Plan del afiliado (ID {afiliado.plan_id}) no está activo."
            )

        # -------------------------------------------------------------
        # RN-04: Vigencia de Prescripción (máximo 30 días)
        # -------------------------------------------------------------
        if req.fecha_dispensa < req.fecha_prescripcion:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="RN-04: La fecha de dispensa no puede ser anterior a la fecha de prescripción."
            )
        dias_diferencia = (req.fecha_dispensa - req.fecha_prescripcion).days
        if dias_diferencia > 30:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"RN-04: La receta está vencida. Han transcurrido {dias_diferencia} días desde la prescripción (máximo permitido: 30 días)."
            )

        # -------------------------------------------------------------
        # RN-06: Cálculo Automático de Coberturas Renglón por Renglón
        # -------------------------------------------------------------
        detalles_db = []
        acum_total_pvp = Decimal("0.00")
        acum_total_cobertura = Decimal("0.00")

        for det in req.detalles:
            monodroga = db.query(Monodroga).filter(Monodroga.id == det.monodroga_id).first()
            if not monodroga or not monodroga.activo:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"La Monodroga ID {det.monodroga_id} no existe o está inactiva."
                )

            # Buscar regla específica en PlanMonodroga
            regla_mono = db.query(PlanMonodroga).filter(
                and_(
                    PlanMonodroga.plan_id == plan.id,
                    PlanMonodroga.monodroga_id == det.monodroga_id,
                    PlanMonodroga.activo == True
                )
            ).first()

            if regla_mono:
                porc_cobertura = Decimal(str(regla_mono.porcentaje_cobertura))
            else:
                porc_cobertura = Decimal(str(plan.cobertura_porcentaje_defecto))

            subtotal_pvp = Decimal(str(det.pvp_unitario)) * Decimal(det.cantidad)
            subtotal_cob = (subtotal_pvp * (porc_cobertura / Decimal("100"))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

            acum_total_pvp += subtotal_pvp
            acum_total_cobertura += subtotal_cob

            detalles_db.append(RecetaDetalle(
                monodroga_id=det.monodroga_id,
                cantidad=det.cantidad,
                pvp_unitario=det.pvp_unitario,
                porcentaje_cobertura=float(porc_cobertura),
                monto_cobertura=float(subtotal_cob)
            ))

        # -------------------------------------------------------------
        # RN-06: Cálculo Automático de Bonificación de Convenio
        # -------------------------------------------------------------
        bonif_convenio = db.query(Bonificacion).filter(
            and_(
                Bonificacion.obra_social_id == req.obra_social_id,
                Bonificacion.farmacia_id == req.farmacia_id,
                Bonificacion.activa == True,
                Bonificacion.fecha_vigencia_desde <= req.fecha_dispensa
            )
        ).first()

        if bonif_convenio:
            porc_bonif = Decimal(str(bonif_convenio.porcentaje_bonificacion))
        else:
            porc_bonif = Decimal("0.00")

        monto_bonificado = (acum_total_pvp * (porc_bonif / Decimal("100"))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        monto_a_cobrar = (acum_total_pvp - monto_bonificado).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        # -------------------------------------------------------------
        # Persistencia Atómica en Base de Datos (Rollback si falla algo)
        # -------------------------------------------------------------
        try:
            nueva_receta = Receta(
                numero_receta=req.numero_receta,
                periodo_id=periodo.id,
                obra_social_id=req.obra_social_id,
                farmacia_id=req.farmacia_id,
                afiliado_id=req.afiliado_id,
                medico_id=req.medico_id,
                fecha_prescripcion=req.fecha_prescripcion,
                fecha_dispensa=req.fecha_dispensa,
                total_pvp=float(acum_total_pvp),
                total_cobertura_os=float(acum_total_cobertura),
                porcentaje_bonificacion_aplicado=float(porc_bonif),
                monto_bonificado=float(monto_bonificado),
                monto_a_cobrar_farmacia=float(monto_a_cobrar),
                estado="VALIDADA",
                detalles=detalles_db
            )

            db.add(nueva_receta)
            db.commit()
            db.refresh(nueva_receta)
            return nueva_receta
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error transaccional al guardar la receta: {str(e)}"
            )