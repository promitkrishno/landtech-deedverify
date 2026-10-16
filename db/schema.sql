CREATE TABLE IF NOT EXISTS deeds (
  id TEXT PRIMARY KEY,
  owner_name TEXT NOT NULL,
  plot_no TEXT NOT NULL,
  khatian_no TEXT NOT NULL,
  mouza TEXT NOT NULL,
  ownership_share REAL NOT NULL DEFAULT 1.0,
  record_hash TEXT NOT NULL,
  prev_hash TEXT,
  signature TEXT NOT NULL,
  created_at TEXT NOT NULL
);