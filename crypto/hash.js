// crypto/hash.js
const crypto = require('crypto');

/**
 * Computes a deterministic SHA-256 hash of a deed's core fields,
 * including its ownership share. Any change to owner_name, plot_no,
 * khatian_no, mouza, or ownership_share after registration produces
 * a DIFFERENT hash — that mismatch is how tampering is detected.
 */
function hashRecord(record) {
  const { owner_name, plot_no, khatian_no, mouza, ownership_share, prev_hash } = record;

  if (!owner_name || !plot_no || !khatian_no || !mouza) {
    throw new Error('hashRecord: missing required field(s)');
  }

  const share = (ownership_share !== undefined && ownership_share !== null) ? ownership_share : 1.0;

  const payload = [
    owner_name.trim(),
    plot_no.trim(),
    khatian_no.trim(),
    mouza.trim(),
    Number(share).toFixed(4), // fixed precision so float noise never changes the hash
    prev_hash || ''
  ].join('|');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

module.exports = { hashRecord };