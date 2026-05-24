from __future__ import annotations


EXPANSION_KEYWORDS = {"expand", "expansion", "new facility", "new office", "launch"}
INFRA_KEYWORDS = {"infrastructure", "airport", "highway", "metro", "rail", "port"}


def score_impact(text: str, entities: dict) -> int:
    lowered = (text or "").lower()
    score = 0

    if entities.get("organizations"):
        score += 20
    if entities.get("locations"):
        score += 20
    if entities.get("money"):
        score += 20
    if any(keyword in lowered for keyword in EXPANSION_KEYWORDS):
        score += 20
    if any(keyword in lowered for keyword in INFRA_KEYWORDS):
        score += 20

    return max(0, min(100, score))
