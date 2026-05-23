# Real Estate Opportunity Intelligence Platform

Production-grade monorepo delivering a **Bloomberg-style real-estate demand intelligence system**.

## Stack
- Frontend: Next.js 15, React, TypeScript, Tailwind, Framer Motion, shadcn/ui, Recharts, Leaflet
- Backend: FastAPI async, SQLAlchemy 2, Redis, Celery
- AI/NLP: Grok adapter, spaCy, sentence-transformers, transformers
- Data: PostgreSQL + pgvector, OpenSearch-ready abstractions, Neo4j-ready graph model hooks
- Scraping: BeautifulSoup + Playwright + Scrapy style modular adapters

## Quickstart
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up --build
```

## Services
- `frontend`: dashboard and admin UI
- `backend`: API + orchestration
- `worker`: Celery AI processing worker
- `postgres`, `redis`

## Manual scraping trigger
Scraping is manual-only from API/admin UI. Scheduler scaffolding exists but disabled by default (`ENABLE_SCHEDULER=false`).

## Architecture
See `docs/architecture.md`.
