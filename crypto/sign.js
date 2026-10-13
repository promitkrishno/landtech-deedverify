// crypto/sign.js
require('dotenv').config();
const crypto = require('crypto');

// Convert the escaped \n back into real newlines so Node can parse the PEM
const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
const PUBLIC_KEY = process.env.PUBLIC_KEY.replace(/\\n/g, '\n');

function signHash(hash) {
  return crypto.sign('sha256', Buffer.from(hash), PRIVATE_KEY).toString('base64');
}

function verifySignature(hash, signature) {
  return crypto.verify('sha256', Buffer.from(hash), PUBLIC_KEY, Buffer.from(signature, 'base64'));
}

module.exports = { signHash, verifySignature, PUBLIC_KEY };