from app.schemas.lead import LeadEventOut
from app.scrapers.sources.google_news import GoogleNewsScraper, SecFilingsScraper, StateRFPScraper
from app.services.article_extractor import extract_article
from app.services.entity_extractor import extract_entities
from app.services.event_classifier import classify_event
from app.services.file_storage import append_article_record
from app.services.impact_scorer import score_impact
from app.services.text_cleaner import clean_text

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
    processed_items = []
    for source in sources:
        scraper = SCRAPERS.get(source)
        if not scraper:
            continue

        scraped_articles = await scraper.run(query)
        for article in scraped_articles:
            # Major pipeline upgrade: fetch full text, clean, extract entities, classify, score, then persist.
            extracted = extract_article(article.url)
            raw_text = extracted.get("text") or article.content
            cleaned_text = clean_text(raw_text)
            entities = extract_entities(cleaned_text)
            event_type = classify_event(cleaned_text)
            impact_score = score_impact(cleaned_text, entities)

            record = {
                "url": article.url,
                "title": extracted.get("title") or article.title,
                "source": article.source,
                "published_at": extracted.get("publish_date") or article.published_at,
                "raw_text": raw_text,
                "clean_text": cleaned_text,
                "entities": entities,
                "event_type": event_type,
                "impact_score": impact_score,
            }
            append_article_record(record)

            processed_items.append(
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
                        "people": entities.get("people", []),
                        "dates": entities.get("dates", []),
                    },
                    "clean_text_preview": cleaned_text[:500],
                }
            )

    return {"items": processed_items, "count": len(processed_items)}


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
