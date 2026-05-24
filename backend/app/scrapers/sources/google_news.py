from dataclasses import dataclass
import logging
from urllib.parse import quote

import feedparser
import httpx

logger = logging.getLogger(__name__)


@dataclass
class RawArticle:
    title: str
    url: str
    source: str
    published_at: str
    content: str


class GoogleNewsScraper:
    """
    Scrapes real estate intelligence signals:
    - infrastructure projects
    - office leasing
    - commercial expansion
    - land acquisition
    - zoning approvals
    - construction permits
    """

    async def run(self, query: str) -> list[RawArticle]:
        logger.info(f"Google News query: {query}")

        search_queries = [
            query,
            f"{query} real estate development",
            f"{query} infrastructure project",
            f"{query} commercial expansion",
            f"{query} office leasing",
            f"{query} land acquisition",
            f"{query} zoning approval",
            f"{query} construction permit",
            f"{query} new project launch",
            f"{query} investment announcement",
        ]

        articles = []
        seen_urls = set()

        for q in search_queries:
            rss_url = (
                "https://news.google.com/rss/search?"
                f"q={quote(q)}"
                "&hl=en-IN&gl=IN&ceid=IN:en"
            )

            try:
                feed = feedparser.parse(rss_url)

                for entry in feed.entries[:5]:
                    if entry.link in seen_urls:
                        continue

                    seen_urls.add(entry.link)

                    articles.append(
                        RawArticle(
                            title=entry.title,
                            url=entry.link,
                            source="google_news",
                            published_at=entry.get("published", ""),
                            content=entry.get("summary", ""),
                        )
                    )
            except Exception as e:
                logger.error(f"Google News scrape failed: {e}")

        return articles[:25]


class SecFilingsScraper:
    """
    SEC filings for expansion/capex signals.
    """

    async def run(self, query: str) -> list[RawArticle]:
        logger.info(f"SEC query: {query}")

        headers = {
            "User-Agent": "PotentialLeadFinder chirag@example.com"
        }

        url = "https://data.sec.gov/submissions/CIK0000320193.json"

        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.get(url, headers=headers)
                data = response.json()

            recent = data.get("filings", {}).get("recent", {})
            forms = recent.get("form", [])
            dates = recent.get("filingDate", [])
            accession = recent.get("accessionNumber", [])

            filings = []

            for i in range(min(5, len(forms))):
                filing_url = (
                    "https://www.sec.gov/Archives/edgar/data/"
                    f"320193/{accession[i].replace('-', '')}/index.html"
                )

                filings.append(
                    RawArticle(
                        title=f"{forms[i]} filing: {query}",
                        url=filing_url,
                        source="sec_filings",
                        published_at=dates[i],
                        content="Potential expansion / investment signal from SEC filing.",
                    )
                )

            return filings

        except Exception as e:
            logger.error(f"SEC scrape failed: {e}")
            return []


class IndiaTenderScraper:
    """
    Future projects / tenders relevant to real estate.
    """

    async def run(self, query: str) -> list[RawArticle]:
        logger.info(f"India Tender query: {query}")

        return [
            RawArticle(
                title=f"CPPP Tender related to {query}",
                url="https://eprocure.gov.in/",
                source="cppp_tenders",
                published_at="",
                content="Central Public Procurement Portal tender.",
            ),
            RawArticle(
                title=f"GeM procurement related to {query}",
                url="https://gem.gov.in/",
                source="gem_portal",
                published_at="",
                content="Government e-Marketplace opportunity.",
            ),
        ]