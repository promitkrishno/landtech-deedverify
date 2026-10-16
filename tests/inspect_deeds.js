// tests/inspect_deeds.js
const db = require('../db/db');
const rows = db.prepare(`
  SELECT owner_name, plot_no, khatian_no, mouza, ownership_share, created_at
  FROM deeds
  ORDER BY created_at
`).all();
console.table(rows);