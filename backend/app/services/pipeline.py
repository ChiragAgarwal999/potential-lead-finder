from app.schemas.lead import LeadEventOut

def run_pipeline_for_source(source:str)->dict:
    return {"source":source,"status":"processed","stages":["scraper","cleaning","entity_extraction","classification","sentiment","geotagging","scoring","storage"]}

def mock_dashboard_data()->dict:
    return {"totals":{"leads":4280,"new_events":127,"high_impact":46},"events":[LeadEventOut(id=1,entity='Acme Power',event_type='Infrastructure Expansion',city='Austin',sentiment_growth=0.83,impact_score=0.89).model_dump()]}
