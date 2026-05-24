"""Keyword-based event classification for intelligence pipeline."""

EVENT_KEYWORDS = {
    "Office Expansion": ["office", "hq", "headquarters", "expand office", "new campus"],
    "Infrastructure Project": ["infrastructure", "highway", "bridge", "utility", "grid", "airport"],
    "Land Acquisition": ["land acquisition", "acquire land", "parcel", "site purchase"],
    "Commercial Leasing": ["lease", "leasing", "tenant", "square feet", "sq ft"],
    "Construction Permit": ["permit", "planning approval", "zoning", "construction approval"],
    "Investment Announcement": ["investment", "funding", "capex", "capital expenditure"],
    "Hiring Expansion": ["hiring", "jobs", "recruit", "workforce", "headcount"],
}


def classify_event(text: str) -> str:
    lowered = (text or "").lower()
    for event_name, keywords in EVENT_KEYWORDS.items():
        if any(keyword in lowered for keyword in keywords):
            return event_name
    return "Unknown"
