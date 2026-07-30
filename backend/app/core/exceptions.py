from fastapi import Request, status
from fastapi.responses import JSONResponse
import structlog

logger = structlog.get_logger()

class BusinessException(Exception):
    def __init__(self, message: str, code: str = "BUSINESS_ERROR", status_code: int = status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.code = code
        self.status_code = status_code

class EntityNotFoundException(BusinessException):
    def __init__(self, entity_name: str, entity_id: str | int):
        super().__init__(
            message=f"{entity_name} con ID {entity_id} no fue encontrado.",
            code="ENTITY_NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND
        )

async def business_exception_handler(request: Request, exc: BusinessException):
    logger.warning("business_exception", code=exc.code, message=exc.message, path=request.url.path)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "path": request.url.path
            }
        }
    )

async def global_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Ha ocurrido un error interno e inesperado en el servidor.",
                "path": request.url.path
            }
        }
    )
