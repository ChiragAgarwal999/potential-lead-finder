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
        return [
            RawArticle(
                title=f"{query} surge in Austin",
                url="https://news.example/google/austin",
                source="google_news",
                published_at="2026-05-23T00:00:00Z",
                content="Major employer expansion indicates regional demand growth.",
            )
        ]


class SecFilingsScraper:
    async def run(self, query: str) -> list[RawArticle]:
        return [
            RawArticle(
                title=f"10-K capital expenditure update: {query}",
                url="https://news.example/sec/capex",
                source="sec_filings",
                published_at="2026-05-22T00:00:00Z",
                content="Filing mentions campus investment and hiring plans.",
            )
        ]


class StateRFPScraper:
    async def run(self, query: str) -> list[RawArticle]:
        return [
            RawArticle(
                title=f"State infrastructure RFP issued for {query}",
                url="https://news.example/rfp/state",
                source="state_rfp",
                published_at="2026-05-21T00:00:00Z",
                content="Public procurement notice with high impact zoning projects.",
            )
        ]
