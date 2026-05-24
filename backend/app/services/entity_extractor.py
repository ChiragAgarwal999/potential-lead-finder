"""Named-entity extraction via spaCy."""

from __future__ import annotations

import spacy

_NLP = None


def _get_nlp():
    global _NLP
    if _NLP is None:
        try:
            _NLP = spacy.load("en_core_web_sm")
        except OSError:
            _NLP = spacy.blank("en")
    return _NLP


def _uniq(values: list[str]) -> list[str]:
    return list(dict.fromkeys(v.strip() for v in values if v and v.strip()))


def extract_entities(text: str) -> dict:
    if not text:
        return {
            "organizations": [],
            "people": [],
            "locations": [],
            "money": [],
            "dates": [],
        }

    doc = _get_nlp()(text)
    entities = {
        "organizations": [],
        "people": [],
        "locations": [],
        "money": [],
        "dates": [],
    }

    for ent in doc.ents:
        if ent.label_ == "ORG":
            entities["organizations"].append(ent.text)
        elif ent.label_ == "PERSON":
            entities["people"].append(ent.text)
        elif ent.label_ == "GPE":
            entities["locations"].append(ent.text)
        elif ent.label_ == "MONEY":
            entities["money"].append(ent.text)
        elif ent.label_ == "DATE":
            entities["dates"].append(ent.text)

    return {key: _uniq(value) for key, value in entities.items()}
