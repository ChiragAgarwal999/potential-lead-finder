from fastapi import FastAPI
from app.api.v1.routes import router

app = FastAPI(title="Real Estate Opportunity Intelligence API", version="1.0.0")
app.include_router(router, prefix="/api/v1")

@app.get('/health')
async def health():
    return {"status": "ok"}
