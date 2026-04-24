// routes/properties.js
const express  = require('express');
const router   = express.Router();
const upload   = require('../middleware/upload');
const { protect, authorise } = require('../middleware/auth');
const {
  getProperties, getPropertyById, createProperty,
  updateProperty, deleteProperty, getMyProperties, getFeatured,
} = require('../controllers/propertyController');

router.get('/featured',  getFeatured);
router.get('/my',        protect, getMyProperties);
router.get('/',          getProperties);
router.get('/:id',       getPropertyById);

router.post('/',   protect, authorise('seller','admin'), upload.array('images', 10), createProperty);
router.put('/:id', protect, authorise('seller','admin'), updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
