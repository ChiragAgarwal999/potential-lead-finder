"""Utilities for extracting full article content from URLs."""

from __future__ import annotations

from datetime import datetime
from urllib.parse import urlparse

from newspaper import Article


DEFAULT_EXTRACTED_ARTICLE = {
    "title": "",
    "text": "",
    "authors": [],
    "publish_date": "",
    "top_image": "",
}


def _is_valid_url(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def extract_article(url: str) -> dict:
    """Extract full article details with graceful fallbacks for failures."""
    if not url or not _is_valid_url(url):
        return {**DEFAULT_EXTRACTED_ARTICLE}

    try:
        article = Article(url, request_timeout=8)
        article.download()
        article.parse()
    except Exception:
        # Any timeout/network/parser issue returns an empty extraction payload.
        return {**DEFAULT_EXTRACTED_ARTICLE}

    text = (article.text or "").strip()
    if not text:
        return {**DEFAULT_EXTRACTED_ARTICLE, "title": (article.title or "").strip()}

    publish_date = ""
    if isinstance(article.publish_date, datetime):
        publish_date = article.publish_date.isoformat()

    return {
        "title": (article.title or "").strip(),
        "text": text,
        "authors": article.authors or [],
        "publish_date": publish_date,
        "top_image": (article.top_image or "").strip(),
    }
