from typing import Generic, List, TypeVar, Optional
from pydantic import BaseModel, Field

T = TypeVar("T")

class PageResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int = Field(..., description="Total de registros encontrados")
    page: int = Field(..., description="Página actual (1-based)")
    size: int = Field(..., description="Cantidad de elementos por página")
    pages: int = Field(..., description="Total de páginas disponibles")

class MessageResponse(BaseModel):
    message: str
    id: Optional[int] = None