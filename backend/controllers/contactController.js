// controllers/contactController.js — Enquiry / Contact requests
const db = require('../config/db');

// ── POST /api/contact ────────────────────────────────────────
exports.submitContact = async (req, res) => {
  const { property_id, name, email, phone, message } = req.body;
  const userId = req.user?.id || null;
  try {
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });

    await db.query(
      'INSERT INTO contact_requests (user_id,property_id,name,email,phone,message) VALUES (?,?,?,?,?,?)',
      [userId, property_id || null, name, email, phone || null, message]
    );
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully! The owner will contact you shortly.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/contact (admin only) ───────────────────────────
exports.getAllContacts = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT cr.*, p.title AS property_title
       FROM contact_requests cr
       LEFT JOIN properties p ON p.id = cr.property_id
       ORDER BY cr.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/contact/:id/respond (admin only) ────────────────
exports.markResponded = async (req, res) => {
  try {
    await db.query("UPDATE contact_requests SET status='responded' WHERE id=?", [req.params.id]);
    res.json({ success: true, message: 'Marked as responded' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
