// controllers/adminController.js — Admin Panel operations
const db = require('../config/db');

// ── GET /api/admin/stats ─────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [[{ totalUsers }]]      = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalProperties }]] = await db.query('SELECT COUNT(*) AS totalProperties FROM properties');
    const [[{ pendingProperties }]] = await db.query("SELECT COUNT(*) AS pendingProperties FROM properties WHERE status='pending'");
    const [[{ totalContacts }]]   = await db.query('SELECT COUNT(*) AS totalContacts FROM contact_requests');
    res.json({ success: true, data: { totalUsers, totalProperties, pendingProperties, totalContacts } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/admin/properties ────────────────────────────────
exports.getAllProperties = async (req, res) => {
  const { status } = req.query;
  try {
    let where = '';
    const params = [];
    if (status) { where = 'WHERE p.status = ?'; params.push(status); }

    const [rows] = await db.query(
      `SELECT p.*, u.name AS owner_name, u.email AS owner_email,
        (SELECT image_url FROM property_images WHERE property_id=p.id AND is_primary=1 LIMIT 1) AS primary_image
       FROM properties p
       JOIN users u ON u.id = p.owner_id
       ${where}
       ORDER BY p.created_at DESC`,
      params
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/admin/properties/:id/status ─────────────────────
exports.updatePropertyStatus = async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });
  try {
    await db.query('UPDATE properties SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ success: true, message: `Property ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/admin/properties/:id ────────────────────────
exports.deleteProperty = async (req, res) => {
  try {
    await db.query('DELETE FROM properties WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/admin/users ─────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/admin/users/:id/toggle ──────────────────────────
exports.toggleUserStatus = async (req, res) => {
  try {
    await db.query('UPDATE users SET is_active = NOT is_active WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'User status toggled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/admin/users/:id ──────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    if (Number(req.params.id) === req.user.id)
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    await db.query('DELETE FROM users WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
