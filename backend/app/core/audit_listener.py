import json
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Dict
from sqlalchemy import event, inspect
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import NO_VALUE, NEVER_SET

from app.core.audit_context import get_audit_user_id, get_audit_ip_address
from app.models.domain_models import AuditoriaLog

def custom_serializer(obj: Any) -> Any:
    """Serializador JSON para tipos no nativos de Python."""
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)
    return str(obj)

def register_audit_listeners():
    @event.listens_for(Session, "before_flush")
    def before_flush(session: Session, flush_context: Any, instances: Any):
        user_id = get_audit_user_id()
        ip_origen = get_audit_ip_address()

        logs_to_add = []

        # 1. Capturar INSERTS (Altas)
        for obj in session.new:
            if isinstance(obj, AuditoriaLog):
                continue
            
            state = inspect(obj)
            mapper = state.mapper
            table_name = mapper.persist_selectable.name
            
            new_vals = {
                attr.key: getattr(obj, attr.key)
                for attr in mapper.column_attrs
            }

            pk_val = getattr(obj, mapper.primary_key[0].name, 0)

            logs_to_add.append(AuditoriaLog(
                usuario_id=user_id,
                ip_origen=ip_origen,
                tabla_afectada=table_name,
                registro_id=pk_val if pk_val else 0,
                operacion="INSERT",
                valor_anterior=None,
                valor_nuevo=json.dumps(new_vals, default=custom_serializer, ensure_ascii=False)
            ))

        # 2. Capturar UPDATES (Modificaciones)
        for obj in session.dirty:
            if isinstance(obj, AuditoriaLog):
                continue

            state = inspect(obj)
            if not session.is_modified(obj, include_collections=False):
                continue

            mapper = state.mapper
            table_name = mapper.persist_selectable.name
            pk_val = getattr(obj, mapper.primary_key[0].name)

            old_vals: Dict[str, Any] = {}
            new_vals: Dict[str, Any] = {}

            for attr in mapper.column_attrs:
                hist = state.attrs[attr.key].history
                if hist.has_changes():
                    old_val = None
                    if hist.deleted and hist.deleted[0] not in (NO_VALUE, NEVER_SET):
                        old_val = hist.deleted[0]
                    elif attr.key in state.committed_state and state.committed_state[attr.key] not in (NO_VALUE, NEVER_SET):
                        old_val = state.committed_state[attr.key]

                    new_val = hist.added[0] if hist.added else getattr(obj, attr.key)

                    old_vals[attr.key] = old_val
                    new_vals[attr.key] = new_val

            if old_vals or new_vals:
                logs_to_add.append(AuditoriaLog(
                    usuario_id=user_id,
                    ip_origen=ip_origen,
                    tabla_afectada=table_name,
                    registro_id=pk_val,
                    operacion="UPDATE",
                    valor_anterior=json.dumps(old_vals, default=custom_serializer, ensure_ascii=False),
                    valor_nuevo=json.dumps(new_vals, default=custom_serializer, ensure_ascii=False)
                ))

        # 3. Capturar DELETES (Bajas)
        for obj in session.deleted:
            if isinstance(obj, AuditoriaLog):
                continue

            state = inspect(obj)
            mapper = state.mapper
            table_name = mapper.persist_selectable.name
            pk_val = getattr(obj, mapper.primary_key[0].name)

            old_vals = {
                attr.key: getattr(obj, attr.key)
                for attr in mapper.column_attrs
            }

            logs_to_add.append(AuditoriaLog(
                usuario_id=user_id,
                ip_origen=ip_origen,
                tabla_afectada=table_name,
                registro_id=pk_val,
                operacion="DELETE",
                valor_anterior=json.dumps(old_vals, default=custom_serializer, ensure_ascii=False),
                valor_nuevo=None
            ))

        for log in logs_to_add:
            session.add(log)