# Potential Lead Finder

Production-grade full-stack application for enterprise lead opportunity intelligence.

## Stack
- Frontend: Next.js 15, TypeScript, Tailwind CSS, Framer Motion, React Query, Zustand, Recharts, Lucide
- Backend: FastAPI, Pydantic, SQLAlchemy, PostgreSQL, Alembic
- Async-ready: Celery-style task abstraction with manual triggers and scheduler feature flag
- Extensibility: OpenSearch, Kafka event bus, Neo4j-ready graph projection interfaces

## Local Development (No Docker)

### 1) Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### 2) Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend: http://localhost:3000  
Backend: http://localhost:8000/api/v1/health

## Product Areas
- Overview Dashboard
- Source Management
- Event Intelligence
- Geographic Intelligence
- Lead Opportunity Scoring
- Admin Panel with manual orchestration controls
