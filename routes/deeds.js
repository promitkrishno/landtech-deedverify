// routes/deeds.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const db = require('../db/db');
const { buildNewDeedRecord, verifyDeedById } = require('../crypto/chain');

// GET /register → show the registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// POST /register → create a new deed, return QR code
router.post('/register', async (req, res) => {
  try {
    const { owner_name, plot_no, khatian_no, mouza } = req.body;

    if (!owner_name || !plot_no || !khatian_no || !mouza) {
      return res.status(400).render('register', { error: 'All fields are required.' });
    }

    const id = uuidv4();
    const deed = buildNewDeedRecord({ id, owner_name, plot_no, khatian_no, mouza });

    db.prepare(`
      INSERT INTO deeds (id, owner_name, plot_no, khatian_no, mouza, record_hash, prev_hash, signature, created_at)
      VALUES (@id, @owner_name, @plot_no, @khatian_no, @mouza, @record_hash, @prev_hash, @signature, @created_at)
    `).run(deed);

    // QR encodes just the deed ID — verify route looks everything else up from the DB
    const qrPayload = JSON.stringify({ id: deed.id });
    const qrImage = await QRCode.toDataURL(qrPayload);

    res.render('result', { deed, qrImage });
  } catch (err) {
    console.error(err);
    res.status(500).render('register', { error: 'Something went wrong. Please try again.' });
  }
});

// DEMO-ONLY: simulates tampering directly in the database, to prove
// our hash/signature verification catches unauthorized edits.
// Gated behind a shared secret — never exposed in the real UI.
router.post('/admin/tamper/:id', (req, res) => {
  const { owner_name, key } = req.body;

  if (key !== process.env.ADMIN_DEMO_KEY) {
    return res.status(403).send('Forbidden: invalid demo key.');
  }

  db.prepare('UPDATE deeds SET owner_name = ? WHERE id = ?').run(owner_name, req.params.id);
  res.send(`Tampered deed ${req.params.id} — owner_name changed to "${owner_name}".`);
});

// GET /verify → show the verify form / scanner
router.get('/verify', (req, res) => {
  res.render('verify', { result: null });
});

// POST /verify → check a deed by ID
router.post('/verify', (req, res) => {
  const { id } = req.body;
  const result = verifyDeedById(id);
  res.render('verify', { result });
});

module.exports = router;