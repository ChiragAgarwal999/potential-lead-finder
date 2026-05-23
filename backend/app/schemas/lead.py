from pydantic import BaseModel
class LeadEventOut(BaseModel):
    id:int; entity:str; event_type:str; city:str; sentiment_growth:float; impact_score:float
    model_config = {"from_attributes": True}
