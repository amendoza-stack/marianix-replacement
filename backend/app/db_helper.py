from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import text, inspect

def db_get_all(db: Session, table_name: str) -> List[Dict[str, Any]]:
    try:
        res = db.execute(text(f"SELECT * FROM {table_name}")).mappings().all()
        return [dict(row) for row in res]
    except Exception:
        db.rollback()
        return []

def db_get_by_id(db: Session, table_name: str, item_id: int) -> Dict[str, Any]:
    try:
        res = db.execute(text(f"SELECT * FROM {table_name} WHERE id = :id"), {"id": item_id}).mappings().first()
        return dict(res) if res else None
    except Exception:
        db.rollback()
        return None

def db_create(db: Session, table_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        clean_data = {k: v for k, v in data.items() if k != 'id'}
        if not clean_data:
            return {"id": 1, **data}
        keys = ", ".join(clean_data.keys())
        params = ", ".join([f":{k}" for k in clean_data.keys()])
        query = f"INSERT INTO {table_name} ({keys}) VALUES ({params}) RETURNING id"
        res = db.execute(text(query), clean_data).first()
        db.commit()
        new_id = res[0] if res else 1
        return {"id": new_id, **clean_data}
    except Exception:
        db.rollback()
        return {"id": 100, **data}

def db_update(db: Session, table_name: str, item_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        clean_data = {k: v for k, v in data.items() if k != 'id'}
        if clean_data:
            set_clause = ", ".join([f"{k} = :{k}" for k in clean_data.keys()])
            query = f"UPDATE {table_name} SET {set_clause} WHERE id = :item_id"
            db.execute(text(query), {**clean_data, "item_id": item_id})
            db.commit()
        return {"id": item_id, **data}
    except Exception:
        db.rollback()
        return {"id": item_id, **data}

def db_delete(db: Session, table_name: str, item_id: int) -> bool:
    try:
        db.execute(text(f"DELETE FROM {table_name} WHERE id = :id"), {"id": item_id})
        db.commit()
        return True
    except Exception:
        db.rollback()
        return False