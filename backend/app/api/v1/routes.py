from fastapi import APIRouter
from app.schemas.intelligence import ScrapeRequest

# import your scrapers
from app.scrapers.sources.google_news import (
    GoogleNewsScraper,
    SecFilingsScraper,
    IndiaTenderScraper,
)

router = APIRouter()


@router.post("/scrape/trigger")
async def trigger_scrape(payload: ScrapeRequest):
    print("QQQ payload:", payload.model_dump())
    print("Sources:", payload.sources)
    print("Query:", payload.query)

    all_items = []

    # Google News
    if "google_news" in payload.sources:
        scraper = GoogleNewsScraper()
        items = await scraper.run(payload.query)
        all_items.extend(items)

    # SEC Filings
    if "sec_filings" in payload.sources:
        scraper = SecFilingsScraper()
        items = await scraper.run(payload.query)
        all_items.extend(items)

    # State RFP
    if "state_rfp" in payload.sources:
        scraper = IndiaTenderScraper()
        items = await scraper.run(payload.query)
        all_items.extend(items)

    return {
        "queued": True,
        "sources": payload.sources,
        "count": len(all_items),
        "items": all_items,
    }


@router.get("/articles")
async def get_articles():
    return {"items": []}


@router.get("/events")
async def get_events():
    return {"items": []}


@router.get("/hotspots")
async def get_hotspots():
    return {"items": []}


@router.get("/sentiment")
async def get_sentiment():
    return {"items": []}


@router.get("/ai-summaries")
async def get_ai_summaries():
    return {"items": []}


@router.get("/search")
async def search_intelligence(q: str):
    return {"query": q, "items": []}


@router.get("/companies/{company_id}/insights")
async def company_insights(company_id: str):
    return {"company_id": company_id, "insights": []}


@router.get("/locations/{location_id}/insights")
async def location_insights(location_id: str):
    return {"location_id": location_id, "insights": []}