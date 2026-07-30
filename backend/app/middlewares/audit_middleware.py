from fastapi import Request
from jose import jwt
from app.core.config import settings
from app.core.audit_context import set_audit_context

async def audit_context_middleware(request: Request, call_next):
    # Extract Client IP
    client_ip = request.client.host if request.client else "127.0.0.1"
    if "x-forwarded-for" in request.headers:
        client_ip = request.headers["x-forwarded-for"].split(",")[0].strip()

    # Extract User ID from Authorization Bearer Token if present
    user_id = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            if payload.get("type") == "access":
                user_id = int(payload.get("sub"))
        except Exception:
            user_id = None

    # Establecer variables de contexto
    set_audit_context(user_id=user_id, ip_address=client_ip)

    response = await call_next(request)
    return response
