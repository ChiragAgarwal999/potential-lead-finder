from dataclasses import dataclass

@dataclass
class RawArticle:
    title: str
    url: str
    source: str
    published_at: str
    content: str

class GoogleNewsScraper:
    async def run(self, query: str) -> list[RawArticle]:
        return [RawArticle(title=f"{query} expansion in Bengaluru", url="https://news.example", source="google_news", published_at="2026-05-23T00:00:00Z", content="Sample content")]
