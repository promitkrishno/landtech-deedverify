const db = require('../db/db');
const { buildNewDeedRecord, verifyDeedById } = require('../crypto/chain');
const { v4: uuidv4 } = require('uuid');

// Clean slate for repeatable testing
db.prepare('DELETE FROM deeds').run();

const id1 = uuidv4();
const deed1 = buildNewDeedRecord({ id: id1, owner_name: 'Karim Mia', plot_no: '145', khatian_no: 'BS-203', mouza: 'Savar' });
db.prepare(`INSERT INTO deeds (id, owner_name, plot_no, khatian_no, mouza, record_hash, prev_hash, signature, created_at)
            VALUES (@id, @owner_name, @plot_no, @khatian_no, @mouza, @record_hash, @prev_hash, @signature, @created_at)`).run(deed1);

console.log('Verify untampered:', verifyDeedById(id1).status); // expect VERIFIED

// Simulate tampering directly in the DB (same trick your admin route will use later)
db.prepare('UPDATE deeds SET owner_name = ? WHERE id = ?').run('Rahim Mia', id1);

console.log('Verify tampered:', verifyDeedById(id1).status); // expect TAMPERED

console.log('Verify missing:', verifyDeedById('nonexistent-id').status); // expect NOT_FOUND
