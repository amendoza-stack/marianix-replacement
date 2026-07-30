import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Dict, Optional

class ReportStorageService:
    # Mapeo en memoria de Tokens de Descarga -> Ruta del Archivo
    _tokens: Dict[str, dict] = {}
    STORAGE_DIR = os.path.abspath("temp_reports")

    @classmethod
    def create_download_token(cls, file_path: str, filename: str, expires_in_minutes: int = 30) -> str:
        token = uuid.uuid4().hex
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=expires_in_minutes)
        cls._tokens[token] = {
            "file_path": file_path,
            "filename": filename,
            "expires_at": expires_at
        }
        return token

    @classmethod
    def get_file_info(cls, token: str) -> Optional[dict]:
        info = cls._tokens.get(token)
        if not info:
            return None
        if datetime.now(timezone.utc) > info["expires_at"]:
            # Limpiar archivo expirado
            if os.path.exists(info["file_path"]):
                os.remove(info["file_path"])
            del cls._tokens[token]
            return None
        return info