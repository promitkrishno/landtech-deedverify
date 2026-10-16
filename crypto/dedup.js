// crypto/dedup.js
const db = require('../db/db');

// Tiny floating-point slack when summing shares (so 0.3+0.3+0.4 doesn't
// fail due to binary rounding).
const EPSILON = 0.0001;

/**
 * Checks whether a proposed registration for a parcel
 * (mouza + khatian_no + plot_no) is a legitimate addition — e.g. co-ownership —
 * or a conflicting/fraudulent duplicate (double-selling, over-claiming).
 */
function validateParcelRegistration({ mouza, khatian_no, plot_no, ownership_share }) {
  const share = Number(ownership_share);

  if (isNaN(share) || share <= 0 || share > 1) {
    return {
      allowed: false,
      reason: 'Ownership share must be greater than 0 and no greater than 1 (e.g. 1 for full ownership, 0.5 for a half-share).'
    };
  }

  const existing = db.prepare(`
    SELECT owner_name, ownership_share
    FROM deeds
    WHERE mouza = ? AND khatian_no = ? AND plot_no = ?
  `).all(mouza.trim(), khatian_no.trim(), plot_no.trim());

  const existingShareTotal = existing.reduce((sum, d) => sum + d.ownership_share, 0);

  if (existingShareTotal + share > 1 + EPSILON) {
    return {
      allowed: false,
      reason: `This parcel (${mouza}, Khatian ${khatian_no}, Plot ${plot_no}) already has ${(existingShareTotal * 100).toFixed(0)}% registered, held by: ${existing.map(d => d.owner_name).join(', ')}. Adding another ${(share * 100).toFixed(0)}% would exceed 100% — blocked as a likely duplicate or fraudulent registration.`,
      existingShareTotal
    };
  }

  return {
    allowed: true,
    reason: existing.length > 0
      ? `Co-ownership: this parcel already has ${(existingShareTotal * 100).toFixed(0)}% registered. This adds the remaining share cleanly.`
      : 'No existing registration for this parcel — proceeding as first owner.',
    existingShareTotal
  };
}

module.exports = { validateParcelRegistration };