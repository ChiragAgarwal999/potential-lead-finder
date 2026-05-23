# Potential Lead Finder

Enterprise full-stack platform for discovering and scoring lead opportunities using scraped signals + NLP enrichment.

## Local Development (No Docker)

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Product Workflow
1. **Source ingestion (manual-first):** Admin triggers `/api/v1/scrape/trigger` with selected sources and query.
2. **Scraping layer:** Source adapters fetch data from `google_news`, `sec_filings`, and `state_rfp`.
3. **Processing pipeline:** cleaning → entity extraction → classification → domain sentiment → geotagging → scoring.
4. **NLP enrichment:** Grok API is used for summarization/entity context and downstream lead signal enrichment.
5. **Storage + APIs:** Scored events are exposed through dashboard and admin APIs.
6. **UI intelligence:** Dashboard pages render trends, sentiment, opportunities, and operational controls.

## Component Interaction (Frontend)
- `app/(dashboard)/layout.tsx` mounts the shared shell.
- `components/layout/app-shell.tsx` controls navigation, top bar, search, theme, and user actions.
- Page modules (`overview`, `sources`, `events`, `geography`, `opportunities`, `admin`) consume API responses and render feature-specific widgets.
- `lib/utils.ts` provides shared className composition helpers.

## Scraping Sources
Current built-in source adapters:
- Google News-style signals (`google_news`)
- SEC filing signals (`sec_filings`)
- State procurement/RFP signals (`state_rfp`)

You can trigger them together via:
```json
{
  "sources": ["google_news", "sec_filings", "state_rfp"],
  "query": "infrastructure expansion",
  "max_articles_per_source": 25
}
```

## Environment Variables

### Backend (`backend/.env`)
- `APP_NAME` - API service name
- `DATABASE_URL` - PostgreSQL DSN
- `REDIS_URL` - Redis connection (optional fallback pattern)
- `ENABLE_SCHEDULER` - keep `false` for manual-first mode
- `GROK_API_KEY` - Grok API secret for NLP enrichment
- `GROK_BASE_URL` - Grok endpoint base URL
- `GROK_MODEL` - model name used for NLP tasks
- `DEFAULT_SCRAPE_SOURCES` - comma-separated default sources

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_URL` - FastAPI base URL
- `NEXT_PUBLIC_APP_NAME` - UI app display name

## Core APIs
- `GET /api/v1/health`
- `GET /api/v1/dashboard`
- `POST /api/v1/scrape/trigger`
- `POST /api/v1/sources/{source_id}/trigger`
- `POST /api/v1/admin/tasks/{task_name}`
