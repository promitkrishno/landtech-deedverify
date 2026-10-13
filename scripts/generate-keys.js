// scripts/generate-keys.js
// Run this ONCE to generate your keypair. Copy the output into your .env file.
const { generateKeyPairSync } = require('crypto');

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

// PEM keys contain real newlines — we escape them so they fit on one .env line
console.log('PUBLIC_KEY="' + publicKey.replace(/\n/g, '\\n') + '"');
console.log('PRIVATE_KEY="' + privateKey.replace(/\n/g, '\\n') + '"');