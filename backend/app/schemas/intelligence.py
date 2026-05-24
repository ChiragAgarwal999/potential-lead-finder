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
    content: str


class EntityPayload(BaseModel):
    organizations: list[str] = Field(default_factory=list)
    people: list[str] = Field(default_factory=list)
    locations: list[str] = Field(default_factory=list)
    money: list[str] = Field(default_factory=list)
    dates: list[str] = Field(default_factory=list)


class ProcessedSourceArticle(BaseModel):
    title: str
    url: str
    source: str
    published_at: str
    event_type: str
    impact_score: int
    entities: EntityPayload
    clean_text_preview: str = ""
