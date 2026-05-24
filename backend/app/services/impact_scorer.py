"""Heuristic scoring for potential lead impact."""


def score_impact(text: str, entities: dict) -> int:
    score = 10
    lowered = (text or "").lower()

    if entities.get("organizations"):
        score += 20
    if entities.get("locations"):
        score += 15
    if entities.get("money"):
        score += 25

    if any(k in lowered for k in ["expand", "expansion", "new office", "headquarters"]):
        score += 15
    if any(k in lowered for k in ["infrastructure", "permit", "construction", "project"]):
        score += 15

    return max(0, min(100, score))
