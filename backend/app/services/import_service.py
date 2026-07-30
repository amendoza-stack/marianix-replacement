import uuid
from datetime import date, datetime
from typing import List, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.import_models import StagingReceta, ImportLog
from app.services.import_strategies import ImportStrategy, PipeDelimitedLayoutStrategy
from app.services.receta_service import RecetaService
from app.schemas.receta_schemas import RecetaCreateRequest, RecetaDetalleInput

class ImportBatchService:
    @staticmethod
    def process_txt_import(
        db: Session,
        content: str,
        filename: str,
        strategy: ImportStrategy = PipeDelimitedLayoutStrategy(),
        atomic_rollback: bool = False
    ) -> ImportLog:
        lines = [line.strip() for line in content.splitlines() if line.strip()]
        if not lines:
            raise HTTPException(status_code=400, detail="El archivo TXT está vacío.")

        # 1. Validar Encabezado
        if not strategy.validate_header(lines[0]):
            raise HTTPException(
                status_code=400,
                detail=f"Encabezado del archivo inválido. Se esperaba: '{PipeDelimitedLayoutStrategy.EXPECTED_HEADER}'"
            )

        batch_id = f"BATCH-{uuid.uuid4().hex[:10].upper()}"
        data_lines = lines[1:]
        
        log_records: List[str] = [f"--- INICIO DE IMPORTACION BATCH: {batch_id} ---", f"Archivo: {filename}", f"Total de Registros: {len(data_lines)}"]
        
        procesadas = 0
        rechazadas = 0
        observadas = 0

        staging_items: List[StagingReceta] = []

        # 2. Fase de Staging y Parseo Línea por Línea
        for idx, line in enumerate(data_lines, start=2):
            success, parsed, error_msg = strategy.parse_line(line, idx)
            if not success:
                rechazadas += 1
                log_records.append(f"[ERROR PARSEO] Línea {idx}: {error_msg}")
                staging_items.append(StagingReceta(
                    batch_id=batch_id, numero_linea=idx, raw_content=line,
                    estado="RECHAZADO", error_mensaje=error_msg
                ))
            else:
                staging_items.append(StagingReceta(
                    batch_id=batch_id, numero_linea=idx, raw_content=line,
                    numero_receta=parsed["numero_receta"],
                    obra_social_id=parsed["obra_social_id"],
                    farmacia_id=parsed["farmacia_id"],
                    afiliado_id=parsed["afiliado_id"],
                    medico_id=parsed["medico_id"],
                    fecha_prescripcion=parsed["fecha_prescripcion"],
                    fecha_dispensa=parsed["fecha_dispensa"],
                    monodroga_id=parsed["monodroga_id"],
                    cantidad=parsed["cantidad"],
                    pvp_unitario=str(parsed["pvp_unitario"]),
                    estado="PENDIENTE"
                ))

        db.add_all(staging_items)
        db.commit()

        # 3. Fase de Procesamiento Batch e Inserción Transaccional
        pending_staging = db.query(StagingReceta).filter(
            StagingReceta.batch_id == batch_id, StagingReceta.estado == "PENDIENTE"
        ).all()

        for item in pending_staging:
            try:
                # Convertir fechas
                f_presc = datetime.strptime(item.fecha_prescripcion, "%Y-%m-%d").date()
                f_disp = datetime.strptime(item.fecha_dispensa, "%Y-%m-%d").date()

                rec_req = RecetaCreateRequest(
                    numero_receta=item.numero_receta,
                    obra_social_id=item.obra_social_id,
                    farmacia_id=item.farmacia_id,
                    afiliado_id=item.afiliado_id,
                    medico_id=item.medico_id,
                    fecha_prescripcion=f_presc,
                    fecha_dispensa=f_disp,
                    detalles=[
                        RecetaDetalleInput(
                            monodroga_id=item.monodroga_id,
                            cantidad=item.cantidad,
                            pvp_unitario=float(item.pvp_unitario)
                        )
                    ]
                )

                # Intentar crear receta usando el servicio transaccional (Validaciones RN-01 a RN-06)
                RecetaService.validate_and_create_receta(db, rec_req)
                item.estado = "PROCESADO"
                procesadas += 1
                log_records.append(f"[OK] Línea {item.numero_linea}: Receta {item.numero_receta} ingresada exitosamente.")
            except HTTPException as http_ex:
                item.estado = "RECHAZADO"
                item.error_mensaje = http_ex.detail
                rechazadas += 1
                log_records.append(f"[RECHAZADO REGLA] Línea {item.numero_linea}: {http_ex.detail}")
            except Exception as ex:
                item.estado = "RECHAZADO"
                item.error_mensaje = str(ex)
                rechazadas += 1
                log_records.append(f"[ERROR SISTEMA] Línea {item.numero_linea}: {str(ex)}")

        db.commit()

        # 4. Guardar Log Final Resumen
        log_records.append(f"--- RESUMEN FINAL ---")
        log_records.append(f"Procesadas Exitosamente: {procesadas}")
        log_records.append(f"Rechazadas: {rechazadas}")
        log_records.append(f"Observadas: {observadas}")

        import_log = ImportLog(
            batch_id=batch_id,
            nombre_archivo=filename,
            total_lineas=len(data_lines),
            procesadas=procesadas,
            rechazadas=rechazadas,
            observadas=observadas,
            log_completo="\n".join(log_records)
        )
        db.add(import_log)
        db.commit()
        db.refresh(import_log)

        return import_log