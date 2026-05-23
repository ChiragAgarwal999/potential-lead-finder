# Architecture

## Core Flow
Scraper -> Cleaning -> Entity Extraction -> Event Classification -> Domain Sentiment (growth/investment/economic/infra) -> Geo Tagging -> Impact Scoring -> Storage -> Dashboard.

## Manual-first Operations
- Admin panel triggers source-specific ingestion.
- Queue workers process AI tasks asynchronously through manual triggers.
- Scheduler module exists but remains disabled by `ENABLE_SCHEDULER=false`.

## Extensibility Interfaces
- OpenSearch adapter for full-text retrieval.
- Graph projection model for entity-event-location relationships.
- Kafka-ready event bus abstraction for future streaming.
