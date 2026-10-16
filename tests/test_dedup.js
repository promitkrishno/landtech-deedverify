// tests/test_dedup.js
const db = require('../db/db');
const { validateParcelRegistration } = require('../crypto/dedup');

db.prepare('DELETE FROM deeds').run();

// Simulate an existing 60% stake already registered on a parcel
db.prepare(`
  INSERT INTO deeds (id, owner_name, plot_no, khatian_no, mouza, ownership_share, record_hash, prev_hash, signature, created_at)
  VALUES ('test-1', 'Existing Owner', 'Plot 1', 'BS-100', 'TestMouza', 0.6, 'fakehash', NULL, 'fakesig', '2026-01-01T00:00:00.000Z')
`).run();

const case1 = validateParcelRegistration({ mouza: 'TestMouza', khatian_no: 'BS-100', plot_no: 'Plot 1', ownership_share: 0.4 });
console.log('Case 1 (0.6 + 0.4 = 100%, should ALLOW):', case1.allowed);

const case2 = validateParcelRegistration({ mouza: 'TestMouza', khatian_no: 'BS-100', plot_no: 'Plot 1', ownership_share: 0.5 });
console.log('Case 2 (0.6 + 0.5 = 110%, should REJECT):', !case2.allowed);

const case3 = validateParcelRegistration({ mouza: 'FreshMouza', khatian_no: 'BS-999', plot_no: 'Plot 9', ownership_share: 1 });
console.log('Case 3 (brand-new parcel, should ALLOW):', case3.allowed);

db.prepare('DELETE FROM deeds').run();