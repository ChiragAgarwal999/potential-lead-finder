from pydantic import BaseModel
class GraphProjection(BaseModel):
    entity:str; event:str; location:str
