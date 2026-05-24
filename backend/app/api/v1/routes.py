from __future__ import annotations

from fastapi import APIRouter

from app.schemas.intelligence import ScrapeRequest
from app.scrapers.sources.google_news import GoogleNewsScraper, IndiaTenderScraper, SecFilingsScraper
from app.services.article_extractor import extract_article
from app.services.entity_extractor import extract_entities
from app.services.event_classifier import classify_event
from app.services.file_storage import append_article
from app.services.impact_scorer import score_impact
from app.services.text_cleaner import clean_text

router = APIRouter()


def _pick_scraper(source: str):
    if source == "google_news":
        return GoogleNewsScraper()
    if source == "sec_filings":
        return SecFilingsScraper()
    if source in ["state_rfp", "india_tenders"]:
        return IndiaTenderScraper()
    return None


@router.post("/scrape/trigger")
async def trigger_scrape(payload: ScrapeRequest):
    all_items = []
    errors = []

    for source in payload.sources:
        scraper = _pick_scraper(source)
        if not scraper:
            continue

        try:
            articles = await scraper.run(payload.query)
        except Exception as exc:  # major stage guard to preserve existing route behavior
            errors.append({"source": source, "error": str(exc)})
            continue

        for article in articles[: payload.max_articles_per_source]:
            # Core intelligence pipeline: extract -> clean -> NLP -> classify -> score -> store.
            extracted = extract_article(article.url)
            raw_text = extracted.get("text") or article.content or ""
            cleaned = clean_text(raw_text)
            entities = extract_entities(cleaned)
            event_type = classify_event(cleaned)
            impact_score = score_impact(cleaned, entities)

            record = {
                "url": article.url,
                "title": extracted.get("title") or article.title,
                "source": article.source,
                "published_at": extracted.get("publish_date") or article.published_at,
                "raw_text": raw_text,
                "clean_text": cleaned,
                "entities": entities,
                "event_type": event_type,
                "impact_score": impact_score,
            }
            append_article(record)

            all_items.append(
                {
                    "title": record["title"],
                    "url": record["url"],
                    "source": record["source"],
                    "published_at": record["published_at"],
                    "event_type": record["event_type"],
                    "impact_score": record["impact_score"],
                    "entities": {
                        "organizations": entities.get("organizations", []),
                        "locations": entities.get("locations", []),
                        "money": entities.get("money", []),
                    },
                    "clean_text": cleaned,
                }
            )

    return {"queued": True, "count": len(all_items), "items": all_items, "errors": errors}


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
