from pydantic import BaseModel, Field


class ScrapeRequest(BaseModel):
    sources: list[str] = Field(default_factory=lambda: ["google_news", "sec_filings", "state_rfp"])
    query: str = "infrastructure expansion"
    max_articles_per_source: int = 25


class SourceArticle(BaseModel):
    title: str
    url: str
    source: str
    published_at: str
    event_type: str | None = None
    impact_score: int | None = None
    entities: dict | None = None
    clean_text: str | None = None
