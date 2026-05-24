"""Text normalization helpers for scraped content."""

import re
import unicodedata

HTML_LEFTOVERS = re.compile(r"<[^>]+>")
JUNK_SYMBOLS = re.compile(r"[^\w\s\.,;:!?'\"\-/()%$€£₹]")
MULTISPACE = re.compile(r"\s+")


def clean_text(text: str) -> str:
    """Clean article text for downstream NLP processing."""
    if not text:
        return ""

    normalized = unicodedata.normalize("NFKC", text)
    normalized = HTML_LEFTOVERS.sub(" ", normalized)
    normalized = JUNK_SYMBOLS.sub(" ", normalized)
    normalized = MULTISPACE.sub(" ", normalized)
    return normalized.strip()
