from sqlalchemy import String, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.db.session import Base
class LeadEvent(Base):
    __tablename__ = "lead_events"
    id: Mapped[int] = mapped_column(primary_key=True)
    entity: Mapped[str] = mapped_column(String(128))
    event_type: Mapped[str] = mapped_column(String(128))
    city: Mapped[str] = mapped_column(String(128))
    sentiment_growth: Mapped[float] = mapped_column(Float)
    impact_score: Mapped[float] = mapped_column(Float)
