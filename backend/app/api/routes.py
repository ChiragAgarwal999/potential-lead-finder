from fastapi import APIRouter
from app.schemas.intelligence import ScrapeRequest
from app.services.pipeline import mock_dashboard_data, run_pipeline_for_source, scrape_sources
from app.workers.tasks import enqueue_manual_task

router = APIRouter()


@router.get('/health')
async def health():
    return {"status": "ok"}


@router.get('/dashboard')
async def dashboard():
    return mock_dashboard_data()


@router.post('/scrape/trigger')
async def trigger_scrape(payload: ScrapeRequest):
    return await scrape_sources(payload.sources, payload.query)


@router.post('/sources/{source_id}/trigger')
async def trigger_source(source_id: str):
    return run_pipeline_for_source(source_id)


@router.post('/admin/tasks/{task_name}')
async def trigger_task(task_name: str):
    return enqueue_manual_task(task_name, {"manual": True})
