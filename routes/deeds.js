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
// DEMO-ONLY: simulates someone tampering with a deed directly in the database.
// This route would NEVER exist in a real production system —
// it exists purely to demonstrate tamper detection for the hackathon demo.
router.post('/admin/tamper/:id', (req, res) => {
  const { owner_name } = req.body;
  db.prepare('UPDATE deeds SET owner_name = ? WHERE id = ?').run(owner_name, req.params.id);
  res.send(`Tampered deed ${req.params.id} — owner_name changed to "${owner_name}". Go verify it now.`);
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