// fix_passwords.js — one-time script to fix seeded user passwords
const bcrypt = require('bcryptjs');
const db = require('./config/db');
require('dotenv').config();

(async () => {
  try {
    const adminHash  = await bcrypt.hash('password', 10);
    const sellerHash = await bcrypt.hash('password', 10);

    await db.query('UPDATE users SET password = ? WHERE email = ?', [adminHash,  'admin@realestateindia.com']);
    await db.query('UPDATE users SET password = ? WHERE email = ?', [sellerHash, 'rajesh@example.com']);

    // Verify
    const [adminRow]  = await db.query('SELECT password FROM users WHERE email = ?', ['admin@realestateindia.com']);
    const [sellerRow] = await db.query('SELECT password FROM users WHERE email = ?', ['rajesh@example.com']);

    const adminOk  = await bcrypt.compare('password', adminRow[0].password);
    const sellerOk = await bcrypt.compare('password', sellerRow[0].password);

    console.log('Admin login works:  ', adminOk);
    console.log('Seller login works: ', sellerOk);

    if (adminOk && sellerOk) {
      console.log('\n✅ Password fix successful! Both accounts now use password: "password"');
    } else {
      console.log('\n❌ Something went wrong!');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
