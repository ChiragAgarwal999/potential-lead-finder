"""Local file storage for processed intelligence records."""

from __future__ import annotations

import json
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "articles.json"


def append_article_record(record: dict) -> None:
    """Append a processed article record to backend/data/articles.json."""
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

    existing: list[dict] = []
    if DATA_FILE.exists():
        try:
            existing = json.loads(DATA_FILE.read_text(encoding="utf-8"))
            if not isinstance(existing, list):
                existing = []
        except json.JSONDecodeError:
            existing = []

    existing.append(record)
    DATA_FILE.write_text(json.dumps(existing, indent=2, ensure_ascii=False), encoding="utf-8")


# Future PostgreSQL integration placeholder:
# from sqlalchemy.orm import Session
# def save_to_db(article: dict, db: Session) -> None:
#     pass
