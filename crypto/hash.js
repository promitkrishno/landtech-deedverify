// crypto/hash.js
const crypto = require('crypto');

/**
 * Computes a deterministic SHA-256 hash of a deed's core fields.
 * Any change to owner_name, plot_no, khatian_no, or mouza
 * after registration will produce a DIFFERENT hash —
 * that mismatch is how we detect tampering at verify time.
 */
function hashRecord(record) {
  const { owner_name, plot_no, khatian_no, mouza, prev_hash } = record;

  if (!owner_name || !plot_no || !khatian_no || !mouza) {
    throw new Error('hashRecord: missing required field(s)');
  }

  const payload = [
    owner_name.trim(),
    plot_no.trim(),
    khatian_no.trim(),
    mouza.trim(),
    prev_hash || ''
  ].join('|');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

module.exports = { hashRecord };