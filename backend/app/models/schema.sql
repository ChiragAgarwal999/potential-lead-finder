CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE articles (
  id UUID PRIMARY KEY,
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  raw_content TEXT,
  published_at TIMESTAMPTZ,
  location_text TEXT,
  embedding vector(768)
);
CREATE TABLE events (
  id UUID PRIMARY KEY,
  article_id UUID REFERENCES articles(id),
  event_type TEXT NOT NULL,
  sentiment_growth INT,
  sentiment_investment INT,
  sentiment_economic INT,
  sentiment_infra INT,
  impact_score NUMERIC,
  opportunity_score NUMERIC,
  lead_probability NUMERIC,
  appreciation_prediction NUMERIC
);
