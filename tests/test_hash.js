const { hashRecord } = require('../crypto/hash');

const record = {
  owner_name: 'Karim Mia',
  plot_no: '145',
  khatian_no: 'BS-203',
  mouza: 'Savar',
  prev_hash: null
};

console.log('Hash:', hashRecord(record));

// Now tamper with one field and confirm the hash changes
const tampered = { ...record, owner_name: 'Rahim Mia' };
console.log('Tampered hash:', hashRecord(tampered));
console.log('Different?', hashRecord(record) !== hashRecord(tampered));