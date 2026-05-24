from __future__ import annotations

import re
import unicodedata
from html import unescape


def clean_text(text: str) -> str:
    """Normalize scraped article text for downstream NLP tasks."""

    if not text:
        return ""

    normalized = unicodedata.normalize("NFKC", text)
    normalized = unescape(normalized)
    normalized = re.sub(r"<[^>]+>", " ", normalized)
    normalized = re.sub(r"[^\w\s.,:%$₹€£@&()\-/'\"]", " ", normalized)
    normalized = re.sub(r"\s+", " ", normalized).strip()
    return normalized
