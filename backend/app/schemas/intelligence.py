from pydantic import BaseModel

class ScrapeRequest(BaseModel):
    sources: list[str]
    max_articles_per_source: int = 100
