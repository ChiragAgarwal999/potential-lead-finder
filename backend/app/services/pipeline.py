from app.schemas.lead import LeadEventOut
from app.scrapers.sources.google_news import GoogleNewsScraper, SecFilingsScraper, StateRFPScraper

SCRAPERS = {
    "google_news": GoogleNewsScraper(),
    "sec_filings": SecFilingsScraper(),
    "state_rfp": StateRFPScraper(),
}


def run_pipeline_for_source(source: str) -> dict:
    return {
        "source": source,
        "status": "processed",
        "stages": [
            "scraper",
            "cleaning",
            "entity_extraction",
            "classification",
            "sentiment",
            "geotagging",
            "scoring",
            "storage",
        ],
    }


async def scrape_sources(sources: list[str], query: str) -> dict:
    items = []
    for source in sources:
        scraper = SCRAPERS.get(source)
        if not scraper:
            continue
        items.extend([a.__dict__ for a in await scraper.run(query)])
    return {"items": items, "count": len(items)}


def mock_dashboard_data() -> dict:
    return {
        "totals": {"leads": 4280, "new_events": 127, "high_impact": 46},
        "events": [
            LeadEventOut(
                id=1,
                entity="Acme Power",
                event_type="Infrastructure Expansion",
                city="Austin",
                sentiment_growth=0.83,
                impact_score=0.89,
            ).model_dump()
        ],
    }
