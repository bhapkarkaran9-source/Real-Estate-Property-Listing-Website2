// routes/favorites.js
const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { toggleFavorite, getFavorites, checkFavorite } = require('../controllers/favoriteController');

router.use(protect); // all favorite routes require auth
router.get('/',                    getFavorites);
router.get('/check/:propertyId',   checkFavorite);
router.post('/:propertyId',        toggleFavorite);

module.exports = router;
