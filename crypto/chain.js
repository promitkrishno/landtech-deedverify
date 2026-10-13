// crypto/chain.js
const db = require('../db/db');
const { hashRecord } = require('./hash');
const { signHash, verifySignature } = require('./sign');

/**
 * Builds a new, fully-hashed and signed deed record,
 * automatically linking it to the previous deed in the chain.
 * Does NOT insert into the DB — just prepares the record.
 */
function buildNewDeedRecord({ id, owner_name, plot_no, khatian_no, mouza }) {
  const last = db.prepare(
    'SELECT record_hash FROM deeds ORDER BY created_at DESC LIMIT 1'
  ).get();

  const prev_hash = last ? last.record_hash : null;

  const record_hash = hashRecord({ owner_name, plot_no, khatian_no, mouza, prev_hash });
  const signature = signHash(record_hash);

  return {
    id,
    owner_name,
    plot_no,
    khatian_no,
    mouza,
    record_hash,
    prev_hash,
    signature,
    created_at: new Date().toISOString()
  };
}

/**
 * Re-verifies a deed as currently stored in the DB.
 * Returns one of: 'VERIFIED' | 'TAMPERED' | 'NOT_FOUND'
 */
function verifyDeedById(id) {
  const deed = db.prepare('SELECT * FROM deeds WHERE id = ?').get(id);
  if (!deed) return { status: 'NOT_FOUND', deed: null };

  // Recompute the hash from the CURRENT stored fields.
  const recomputedHash = hashRecord({
    owner_name: deed.owner_name,
    plot_no: deed.plot_no,
    khatian_no: deed.khatian_no,
    mouza: deed.mouza,
    prev_hash: deed.prev_hash
  });

  const hashMatches = recomputedHash === deed.record_hash;
  const signatureValid = verifySignature(deed.record_hash, deed.signature);

  const status = (hashMatches && signatureValid) ? 'VERIFIED' : 'TAMPERED';
  return { status, deed };
}

module.exports = { buildNewDeedRecord, verifyDeedById };