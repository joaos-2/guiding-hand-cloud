CREATE TABLE IF NOT EXISTS events (
  id          BIGSERIAL PRIMARY KEY,
  obstacle    TEXT        NOT NULL,
  lat         NUMERIC(8,4) NOT NULL,
  lng         NUMERIC(8,4) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barriers (
  id            BIGSERIAL PRIMARY KEY,
  obstacle      TEXT        NOT NULL,
  lat           NUMERIC(8,4) NOT NULL,
  lng           NUMERIC(8,4) NOT NULL,
  confirmations INTEGER     NOT NULL DEFAULT 1,
  status        TEXT        NOT NULL DEFAULT 'pending',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (obstacle, lat, lng)
);

CREATE INDEX IF NOT EXISTS idx_barriers_status ON barriers(status);
