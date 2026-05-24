from __future__ import annotations

EVENT_KEYWORDS = {
    "Office Expansion": ["office expansion", "new office", "workspace", "regional office"],
    "Infrastructure Project": ["infrastructure", "highway", "metro", "airport", "bridge"],
    "Land Acquisition": ["land acquisition", "acquired land", "parcel", "site acquisition"],
    "Commercial Leasing": ["lease", "leased", "leasing", "tenant"],
    "Construction Permit": ["construction permit", "permit approved", "zoning", "approval"],
    "Investment Announcement": ["investment", "funding", "capital infusion", "announced investment"],
    "Hiring Expansion": ["hiring", "jobs", "recruitment", "headcount"],
}


def classify_event(text: str) -> str:
    lowered = (text or "").lower()
    for label, keywords in EVENT_KEYWORDS.items():
        if any(keyword in lowered for keyword in keywords):
            return label
    return "Unknown"
