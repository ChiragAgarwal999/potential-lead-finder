from __future__ import annotations

import json
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "articles.json"


def _load_items() -> list[dict]:
    if not DATA_FILE.exists():
        return []

    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []


def append_article(record: dict) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    items = _load_items()
    items.append(record)
    DATA_FILE.write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8")


# Future PostgreSQL integration placeholder:
# from sqlalchemy.orm import Session
# def save_to_db(article: dict, db: Session) -> None:
#     """Persist structured intelligence to PostgreSQL."""
#     pass
