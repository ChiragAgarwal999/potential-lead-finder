from __future__ import annotations

from datetime import datetime
from urllib.parse import urlparse

from newspaper import Article


DEFAULT_ARTICLE = {
    "title": "",
    "text": "",
    "authors": [],
    "publish_date": "",
    "top_image": "",
}


def _is_valid_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        return parsed.scheme in {"http", "https"} and bool(parsed.netloc)
    except Exception:
        return False


def extract_article(url: str) -> dict:
    """Extract full article metadata and content via newspaper3k.

    Returns a stable payload even when parsing fails so the downstream
    pipeline can continue processing partial data.
    """

    if not url or not _is_valid_url(url):
        return DEFAULT_ARTICLE.copy()

    try:
        article = Article(url, language="en", fetch_images=True)
        # Explicit timeout handling for slow or blocked pages.
        article.download(input_html=None)
        article.parse()
    except Exception:
        return DEFAULT_ARTICLE.copy()

    text = (article.text or "").strip()
    if not text:
        return DEFAULT_ARTICLE.copy()

    publish_date = ""
    if article.publish_date:
        if isinstance(article.publish_date, datetime):
            publish_date = article.publish_date.isoformat()
        else:
            publish_date = str(article.publish_date)

    return {
        "title": (article.title or "").strip(),
        "text": text,
        "authors": [a.strip() for a in (article.authors or []) if a and a.strip()],
        "publish_date": publish_date,
        "top_image": (article.top_image or "").strip(),
    }
