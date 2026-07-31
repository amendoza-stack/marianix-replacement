from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.seguridad import Permiso

router = APIRouter(prefix="/api/v1/permisos", tags=["Permisos"])

@router.get("", response_model=List[Dict[str, Any]])
def get_permisos_agrupados(db: Session = Depends(get_db)):
    """
    Devuelve TODOS los permisos registrados en la DB agrupados jerárquicamente
    por Módulo Padre sin filtros hardcodeados.
    """
    permisos = db.query(Permiso).filter(Permiso.activo == True).all()
    
    agrupados = {}
    for p in permisos:
        mod = p.modulo or "General"
        if mod not in agrupados:
            agrupados[mod] = []
        
        agrupados[mod].append({
            "id": p.id,
            "codigo": p.codigo,
            "nombre": p.nombre,
            "accion": p.accion,
            "descripcion": p.descripcion
        })

    # Formatear respuesta para el Árbol del Frontend
    resultado = []
    for modulo_nombre, lista_permisos in agrupados.items():
        resultado.append({
            "modulo": modulo_nombre,
            "permisos": lista_permisos
        })
        
    return resultado
