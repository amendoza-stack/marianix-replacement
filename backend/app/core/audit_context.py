from contextvars import ContextVar
from typing import Optional

# Variables de contexto aisladas por request
_audit_user_id: ContextVar[Optional[int]] = ContextVar("audit_user_id", default=None)
_audit_ip_address: ContextVar[str] = ContextVar("audit_ip_address", default="127.0.0.1")

def set_audit_context(user_id: Optional[int], ip_address: str):
    _audit_user_id.set(user_id)
    _audit_ip_address.set(ip_address)

def get_audit_user_id() -> Optional[int]:
    return _audit_user_id.get()

def get_audit_ip_address() -> str:
    return _audit_ip_address.get()
