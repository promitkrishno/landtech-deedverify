// tests/debug_verify.js
const { hashRecord } = require('../crypto/hash');
const { verifySignature } = require('../crypto/sign');
const db = require('../db/db');

const id = process.argv[2];
if (!id) {
  console.log('Usage: node tests/debug_verify.js <deed-id>');
  process.exit(1);
}

const deed = db.prepare('SELECT * FROM deeds WHERE id = ?').get(id);
if (!deed) {
  console.log('Deed not found.');
  process.exit(1);
}

const recomputedHash = hashRecord({
  owner_name: deed.owner_name,
  plot_no: deed.plot_no,
  khatian_no: deed.khatian_no,
  mouza: deed.mouza,
  ownership_share: deed.ownership_share,
  prev_hash: deed.prev_hash
});

console.log('Owner:           ', deed.owner_name);
console.log('Ownership share: ', deed.ownership_share);
console.log('Stored hash:     ', deed.record_hash);
console.log('Recomputed hash: ', recomputedHash);
console.log('Hash match?      ', recomputedHash === deed.record_hash);
console.log('Signature valid? ', verifySignature(deed.record_hash, deed.signature));