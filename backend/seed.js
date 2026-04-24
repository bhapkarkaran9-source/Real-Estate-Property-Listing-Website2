// backend/seed.js — Run with: node seed.js
// Creates accounts + inserts properties in each Indian city
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql  = require('mysql2/promise');

const CREDENTIALS = [
  { name:'Admin User',        email:'admin@rei.com',          password:'Admin@2024',   role:'admin'  },
  { name:'Rajesh Kumar',      email:'rajesh@rei.com',         password:'Seller@2024',  role:'seller' },
  { name:'Priya Sharma',      email:'priya@rei.com',          password:'Seller@2024',  role:'seller' },
  { name:'Arjun Mehta',       email:'arjun@rei.com',          password:'Seller@2024',  role:'seller' },
  { name:'Sunita Patel',      email:'sunita@rei.com',         password:'Buyer@2024',   role:'buyer'  },
  { name:'Vikram Singh',      email:'vikram@rei.com',         password:'Buyer@2024',   role:'buyer'  },
];

const CITIES = ['Mumbai','Delhi','Bangalore','Pune','Hyderabad','Chennai','Kolkata','Ahmedabad','Jaipur','Noida','Gurgaon'];
const PROP_TYPES = ['flat', 'villa', 'commercial', 'house', 'plot'];
const IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
];
const AMENITIES = ['Gym', 'Swimming Pool', 'Parking', 'Power Backup', 'Security', 'Wi-Fi', 'AC'];

const PROPERTIES = [];
CITIES.forEach((city, cityIndex) => {
  for (let i = 1; i <= 5; i++) {
    const isRent = i % 2 === 0;
    const type = PROP_TYPES[i % PROP_TYPES.length];
    const price = isRent ? 15000 + (Math.floor(Math.random() * 50) * 1000) : 5000000 + (Math.floor(Math.random() * 50) * 1000000);
    const hasBhk = type !== 'plot' && type !== 'commercial';
    PROPERTIES.push({
      title: `${isRent ? 'Rent' : 'Buy'} ${hasBhk ? (i + 1) + ' BHK ' : ''}${type.toUpperCase()} in ${city} Prime Location`,
      description: `A stunning ${type} located in the heart of ${city}. Fully equipped with modern amenities and ready to move in.`,
      price: price,
      price_type: isRent ? 'rent' : 'sale',
      property_type: type,
      bhk: hasBhk ? i + 1 : null,
      area_sqft: 800 + (i * 200),
      city: city,
      area: `${city} Central`,
      amenities: AMENITIES.slice(0, 3 + (i % 3)),
      img: IMAGES[(cityIndex + i) % IMAGES.length]
    });
  }
});

async function seed() {
  const pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'real_estate_india',
    waitForConnections: true, connectionLimit: 5,
  });

  console.log('\n🌱 Starting seed...\n');

  // ── 1. Clear old seed data ──────────────────────────
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  await pool.query('TRUNCATE TABLE contact_requests');
  await pool.query('TRUNCATE TABLE favorites');
  await pool.query('TRUNCATE TABLE property_images');
  await pool.query('TRUNCATE TABLE properties');
  await pool.query('TRUNCATE TABLE users');
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('✅ Old data cleared');

  // ── 2. Insert users ─────────────────────────────────
  const userIds = {};
  for (const u of CREDENTIALS) {
    const hash = await bcrypt.hash(u.password, 10);
    const [r] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?,?,?,?,?)',
      [u.name, u.email, hash, '9' + String(Math.floor(Math.random()*1000000000)).padStart(9,'0'), u.role]
    );
    userIds[u.email] = r.insertId;
    console.log(`  👤 ${u.role.toUpperCase().padEnd(7)} | ${u.email.padEnd(22)} | pass: ${u.password}`);
  }

  // ── 3. Insert properties (round-robin sellers) ──────
  const sellerEmails = CREDENTIALS.filter(u => u.role === 'seller').map(u => u.email);
  let si = 0;

  for (const p of PROPERTIES) {
    const ownerId = userIds[sellerEmails[si % sellerEmails.length]];
    si++;

    const [pr] = await pool.query(
      `INSERT INTO properties
        (title,description,price,price_type,property_type,bhk,area_sqft,
         location_city,location_area,amenities,status,owner_id)
       VALUES (?,?,?,?,?,?,?,?,?,?,'approved',?)`,
      [p.title, p.description, p.price, p.price_type, p.property_type,
       p.bhk || null, p.area_sqft, p.city, p.area,
       JSON.stringify(p.amenities), ownerId]
    );

    await pool.query(
      'INSERT INTO property_images (property_id, image_url, is_primary) VALUES (?,?,1)',
      [pr.insertId, p.img]
    );

    console.log(`  🏠 ${p.city.padEnd(12)} | ${p.title.substring(0,50)}`);
  }

  // ── 4. Summary ──────────────────────────────────────
  console.log('\n' + '─'.repeat(60));
  console.log('🎉 Seed complete!\n');
  console.log('📋 LOGIN CREDENTIALS');
  console.log('─'.repeat(60));
  for (const u of CREDENTIALS) {
    console.log(`  ${u.role.toUpperCase().padEnd(8)} | ${u.email.padEnd(25)} | ${u.password}`);
  }
  console.log('─'.repeat(60));
  console.log(`\n✅ ${PROPERTIES.length} properties inserted across ${[...new Set(PROPERTIES.map(p=>p.city))].length} cities`);
  console.log('✅ Frontend: http://localhost:5173');
  console.log('✅ Backend:  http://localhost:5000\n');

  await pool.end();
}

seed().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });
