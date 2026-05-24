from fastapi import APIRouter
from app.schemas.intelligence import ScrapeRequest
from app.services.pipeline import scrape_sources

router = APIRouter()


@router.post("/scrape/trigger")
async def trigger_scrape(payload: ScrapeRequest):
    processed = await scrape_sources(payload.sources, payload.query)
    return {
        "queued": True,
        "sources": payload.sources,
        "count": processed["count"],
        "items": processed["items"],
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
