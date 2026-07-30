from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Integer, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class StagingReceta(Base):
    __tablename__ = "staging_receta"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    batch_id: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    numero_linea: Mapped[int] = mapped_column(Integer, nullable=False)
    raw_content: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Campos extraídos
    numero_receta: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    obra_social_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    farmacia_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    afiliado_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    medico_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    fecha_prescripcion: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    fecha_dispensa: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    monodroga_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    cantidad: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    pvp_unitario: Mapped[Optional[float]] = mapped_column(Text, nullable=True)

    # Estado del Staging
    estado: Mapped[str] = mapped_column(String(20), default="PENDIENTE") # PENDIENTE, PROCESADO, RECHAZADO, OBSERVADO
    error_mensaje: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

class ImportLog(Base):
    __tablename__ = "import_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    batch_id: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    nombre_archivo: Mapped[str] = mapped_column(String(150), nullable=False)
    total_lineas: Mapped[int] = mapped_column(Integer, default=0)
    procesadas: Mapped[int] = mapped_column(Integer, default=0)
    rechazadas: Mapped[int] = mapped_column(Integer, default=0)
    observadas: Mapped[int] = mapped_column(Integer, default=0)
    log_completo: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))