// controllers/favoriteController.js — Wishlist / Favorites
const db = require('../config/db');

// ── POST /api/favorites/:propertyId ─────────────────────────
exports.toggleFavorite = async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.user.id;
  try {
    const [existing] = await db.query(
      'SELECT id FROM favorites WHERE user_id=? AND property_id=?',
      [userId, propertyId]
    );
    if (existing.length) {
      await db.query('DELETE FROM favorites WHERE user_id=? AND property_id=?', [userId, propertyId]);
      return res.json({ success: true, favorited: false, message: 'Removed from favorites' });
    }
    await db.query('INSERT INTO favorites (user_id, property_id) VALUES (?,?)', [userId, propertyId]);
    res.json({ success: true, favorited: true, message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/favorites ───────────────────────────────────────
exports.getFavorites = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, f.created_at AS favorited_at,
        (SELECT image_url FROM property_images WHERE property_id=p.id AND is_primary=1 LIMIT 1) AS primary_image
       FROM favorites f
       JOIN properties p ON p.id = f.property_id
       WHERE f.user_id = ? AND p.status = 'approved'
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/favorites/check/:propertyId ─────────────────────
exports.checkFavorite = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id FROM favorites WHERE user_id=? AND property_id=?',
      [req.user.id, req.params.propertyId]
    );
    res.json({ success: true, favorited: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
