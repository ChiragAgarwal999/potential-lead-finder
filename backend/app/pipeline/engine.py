from dataclasses import dataclass

@dataclass
class ProcessedSignal:
    event_type: str
    impact_score: float
    investment_opportunity_score: float
    lead_probability: float
    appreciation_prediction: float

class RealEstateImpactEngine:
    def score(self, event_type: str, employee_count: int = 0, funding_musd: float = 0) -> ProcessedSignal:
        impact = 40.0
        if event_type == 'IPO' and employee_count > 1500:
            impact += 28
        if event_type in {'METRO', 'HIGHWAY', 'SMART_CITY'}:
            impact += 24
        if event_type == 'FUNDING' and funding_musd >= 50:
            impact += 18
        return ProcessedSignal(
            event_type=event_type,
            impact_score=min(100, impact),
            investment_opportunity_score=min(100, impact * 0.95),
            lead_probability=min(100, impact * 0.85),
            appreciation_prediction=min(100, impact * 0.9),
        )
