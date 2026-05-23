# Architecture

## Core flow
Scraper -> Cleaning -> Entity Extraction -> Event Classification -> Domain Sentiment (growth/investment/economic/infra) -> Geo tagging -> Impact scoring -> Storage -> Dashboard.

## Manual-first operations
- Admin panel triggers source specific ingestion.
- Queue workers process AI tasks asynchronously.
- Scheduler module is intentionally disabled by env flag.

## Extensibility
- OpenSearch adapter interface for full text retrieval.
- Neo4j-ready graph projection model for entity-event-location relationships.
- Kafka-ready event bus abstraction in service layer for future streaming.
