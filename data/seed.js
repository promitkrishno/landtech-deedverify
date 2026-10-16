// data/seed.js
// Populates the database with realistic SYNTHETIC deeds for demo purposes.
// No real names, NID numbers, or actual land records are used — all data
// below is fabricated, per the hackathon's data/privacy rules.

const db = require('../db/db');
const { buildNewDeedRecord } = require('../crypto/chain');
const { v4: uuidv4 } = require('uuid');

const syntheticDeeds = [
  { owner_name: 'Abdul Karim',    plot_no: 'Plot 112', khatian_no: 'BS-301', mouza: 'Savar',      ownership_share: 1 },
  { owner_name: 'Nasrin Begum',   plot_no: 'Plot 88',  khatian_no: 'BS-510', mouza: 'Dhamrai',     ownership_share: 1 },
  { owner_name: 'Jahangir Alam',  plot_no: 'Plot 45',  khatian_no: 'RS-220', mouza: 'Keraniganj',  ownership_share: 1 },
  { owner_name: 'Fatema Khatun',  plot_no: 'Plot 67',  khatian_no: 'BS-418', mouza: 'Nawabganj',   ownership_share: 1 },
  { owner_name: 'Shahidul Islam', plot_no: 'Plot 203', khatian_no: 'CS-109', mouza: 'Dohar',       ownership_share: 1 },
  { owner_name: 'Rokeya Sultana', plot_no: 'Plot 19',  khatian_no: 'BS-276', mouza: 'Savar',       ownership_share: 1 },
  { owner_name: 'Mizanur Rahman', plot_no: 'Plot 134', khatian_no: 'SA-158', mouza: 'Keraniganj',  ownership_share: 1 },
  { owner_name: 'Salma Akter',    plot_no: 'Plot 90',  khatian_no: 'BS-392', mouza: 'Nawabganj',   ownership_share: 1 },
  // Legitimate co-ownership: two siblings inheriting one plot, 50% each
  { owner_name: 'Habibur Rahman', plot_no: 'Plot 55',  khatian_no: 'BS-640', mouza: 'Savar',       ownership_share: 0.5 },
  { owner_name: 'Anwara Begum',   plot_no: 'Plot 55',  khatian_no: 'BS-640', mouza: 'Savar',       ownership_share: 0.5 }
];

function seed() {
  const existing = db.prepare('SELECT COUNT(*) AS count FROM deeds').get();
  if (existing.count > 0) {
    console.log(`Database already has ${existing.count} deed(s). Skipping seed to avoid duplicates.`);
    console.log('If you want to reseed from scratch, delete db/landtech.db and restart the server first.');
    return;
  }

  console.log('Seeding synthetic deeds...');

  for (const entry of syntheticDeeds) {
    const id = uuidv4();
    const deed = buildNewDeedRecord({ id, ...entry });

    db.prepare(`
    INSERT INTO deeds (id, owner_name, plot_no, khatian_no, mouza, ownership_share, record_hash, prev_hash, signature, created_at)
    VALUES (@id, @owner_name, @plot_no, @khatian_no, @mouza, @ownership_share, @record_hash, @prev_hash, @signature, @created_at)
    `).run(deed); 

    console.log(`  Registered: ${deed.owner_name} (${deed.id})`);
  }

  console.log(`Done. ${syntheticDeeds.length} synthetic deeds added to the chain.`);
}

seed();