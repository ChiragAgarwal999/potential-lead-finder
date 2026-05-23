from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    app_name: str = "Potential Lead Finder API"
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/potential_leads"
    redis_url: str = "redis://localhost:6379/0"
    enable_scheduler: bool = False
settings = Settings()
