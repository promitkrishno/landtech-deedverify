const { hashRecord } = require('../crypto/hash');
const { signHash, verifySignature } = require('../crypto/sign');

const record = { owner_name: 'Karim Mia', plot_no: '145', khatian_no: 'BS-203', mouza: 'Savar', prev_hash: null };
const hash = hashRecord(record);
const signature = signHash(hash);

console.log('Signature valid?', verifySignature(hash, signature));          // should be true
console.log('Tampered hash rejected?', !verifySignature('fakehash', signature)); // should be true