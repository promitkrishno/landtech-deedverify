// crypto/chain.js
const db = require('../db/db');
const { hashRecord } = require('./hash');
const { signHash, verifySignature } = require('./sign');

function buildNewDeedRecord({ id, owner_name, plot_no, khatian_no, mouza, ownership_share }) {
  const last = db.prepare(
    'SELECT record_hash FROM deeds ORDER BY created_at DESC LIMIT 1'
  ).get();

  const prev_hash = last ? last.record_hash : null;
  const share = (ownership_share !== undefined && ownership_share !== null) ? ownership_share : 1.0;

  const record_hash = hashRecord({ owner_name, plot_no, khatian_no, mouza, ownership_share: share, prev_hash });
  const signature = signHash(record_hash);

  return {
    id,
    owner_name,
    plot_no,
    khatian_no,
    mouza,
    ownership_share: share,
    record_hash,
    prev_hash,
    signature,
    created_at: new Date().toISOString()
  };
}

function verifyDeedById(id) {
  const deed = db.prepare('SELECT * FROM deeds WHERE id = ?').get(id);
  if (!deed) return { status: 'NOT_FOUND', deed: null };

  const recomputedHash = hashRecord({
    owner_name: deed.owner_name,
    plot_no: deed.plot_no,
    khatian_no: deed.khatian_no,
    mouza: deed.mouza,
    ownership_share: deed.ownership_share,
    prev_hash: deed.prev_hash
  });

  const hashMatches = recomputedHash === deed.record_hash;
  const signatureValid = verifySignature(deed.record_hash, deed.signature);

  const status = (hashMatches && signatureValid) ? 'VERIFIED' : 'TAMPERED';
  return { status, deed };
}

module.exports = { buildNewDeedRecord, verifyDeedById };