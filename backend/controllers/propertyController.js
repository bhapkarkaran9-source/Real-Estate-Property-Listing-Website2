// controllers/propertyController.js — Full CRUD for properties
const db     = require('../config/db');
const path   = require('path');

// ── Helper: fetch images for a property ─────────────────────
const getImages = async (propertyId) => {
  const [imgs] = await db.query(
    'SELECT id, image_url, is_primary FROM property_images WHERE property_id = ?',
    [propertyId]
  );
  return imgs;
};

// ── GET /api/properties ──────────────────────────────────────
// Query params: city, type, price_type, bhk, min_price, max_price,
//               sort (price_asc|price_desc|newest), page, limit
exports.getProperties = async (req, res) => {
  try {
    const {
      city, type, price_type, bhk,
      min_price, max_price,
      sort = 'newest', page = 1, limit = 12,
      search,
    } = req.query;

    let where = ["p.status = 'approved'"];
    const params = [];

    if (city)      { where.push('p.location_city = ?');     params.push(city); }
    if (type)      { where.push('p.property_type = ?');     params.push(type); }
    if (price_type){ where.push('p.price_type = ?');        params.push(price_type); }
    if (bhk)       { where.push('p.bhk = ?');               params.push(Number(bhk)); }
    if (min_price) { where.push('p.price >= ?');            params.push(Number(min_price)); }
    if (max_price) { where.push('p.price <= ?');            params.push(Number(max_price)); }
    if (search)    {
      where.push('(p.title LIKE ? OR p.location_city LIKE ? OR p.location_area LIKE ?)');
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const orderMap = {
      price_asc:  'p.price ASC',
      price_desc: 'p.price DESC',
      newest:     'p.created_at DESC',
    };
    const orderSQL = `ORDER BY ${orderMap[sort] || 'p.created_at DESC'}`;

    const offset  = (Number(page) - 1) * Number(limit);
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM properties p ${whereSQL}`,
      params
    );

    const [rows] = await db.query(
      `SELECT p.*, u.name AS owner_name, u.phone AS owner_phone
       FROM properties p
       JOIN users u ON u.id = p.owner_id
       ${whereSQL} ${orderSQL}
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    // Attach primary image to each property
    for (const prop of rows) {
      const [img] = await db.query(
        'SELECT image_url FROM property_images WHERE property_id=? AND is_primary=1 LIMIT 1',
        [prop.id]
      );
      prop.primary_image = img[0]?.image_url || null;
    }

    res.json({
      success: true,
      data: rows,
      pagination: {
        total, page: Number(page), limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/properties/:id ──────────────────────────────────
exports.getPropertyById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, u.name AS owner_name, u.phone AS owner_phone, u.email AS owner_email
       FROM properties p
       JOIN users u ON u.id = p.owner_id
       WHERE p.id = ? AND p.status = 'approved'`,
      [req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, message: 'Property not found' });

    const property = rows[0];
    property.images = await getImages(property.id);

    // Increment view count
    await db.query('UPDATE properties SET views = views + 1 WHERE id = ?', [property.id]);

    res.json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/properties ─────────────────────────────────────
exports.createProperty = async (req, res) => {
  try {
    const {
      title, description, price, price_type, property_type,
      bhk, area_sqft, location_city, location_area,
      location_address, latitude, longitude, amenities,
    } = req.body;

    const amenitiesJSON = typeof amenities === 'string'
      ? amenities : JSON.stringify(amenities || []);

    const [result] = await db.query(
      `INSERT INTO properties
        (title,description,price,price_type,property_type,bhk,area_sqft,
         location_city,location_area,location_address,latitude,longitude,
         amenities,status,owner_id)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'pending',?)`,
      [title, description, price, price_type, property_type, bhk || null,
       area_sqft || null, location_city, location_area || null,
       location_address || null, latitude || null, longitude || null,
       amenitiesJSON, req.user.id]
    );

    const propertyId = result.insertId;

    // Save uploaded images
    if (req.files && req.files.length) {
      for (let i = 0; i < req.files.length; i++) {
        const url = `/uploads/${req.files[i].filename}`;
        await db.query(
          'INSERT INTO property_images (property_id, image_url, is_primary) VALUES (?,?,?)',
          [propertyId, url, i === 0 ? 1 : 0]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Property submitted for admin approval',
      propertyId,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/properties/:id ──────────────────────────────────
exports.updateProperty = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM properties WHERE id=?', [req.params.id]);
    if (!rows.length)
      return res.status(404).json({ success: false, message: 'Property not found' });

    if (rows[0].owner_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised' });

    const {
      title, description, price, price_type, property_type,
      bhk, area_sqft, location_city, location_area,
      location_address, latitude, longitude, amenities,
    } = req.body;

    await db.query(
      `UPDATE properties SET
        title=?,description=?,price=?,price_type=?,property_type=?,
        bhk=?,area_sqft=?,location_city=?,location_area=?,
        location_address=?,latitude=?,longitude=?,amenities=?,status='pending'
       WHERE id=?`,
      [title, description, price, price_type, property_type,
       bhk || null, area_sqft || null, location_city, location_area || null,
       location_address || null, latitude || null, longitude || null,
       JSON.stringify(amenities || []), req.params.id]
    );

    res.json({ success: true, message: 'Property updated and re-submitted for approval' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/properties/:id ───────────────────────────────
exports.deleteProperty = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM properties WHERE id=?', [req.params.id]);
    if (!rows.length)
      return res.status(404).json({ success: false, message: 'Property not found' });

    if (rows[0].owner_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised' });

    await db.query('DELETE FROM properties WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/properties/my ───────────────────────────────────
exports.getMyProperties = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, 
        (SELECT image_url FROM property_images WHERE property_id=p.id AND is_primary=1 LIMIT 1) AS primary_image
       FROM properties p
       WHERE p.owner_id = ?
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/properties/featured ────────────────────────────
exports.getFeatured = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, u.name AS owner_name,
        (SELECT image_url FROM property_images WHERE property_id=p.id AND is_primary=1 LIMIT 1) AS primary_image
       FROM properties p
       JOIN users u ON u.id = p.owner_id
       WHERE p.status = 'approved'
       ORDER BY p.views DESC, p.created_at DESC
       LIMIT 8`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
