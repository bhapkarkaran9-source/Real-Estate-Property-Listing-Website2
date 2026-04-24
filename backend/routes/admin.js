// routes/admin.js
const express = require('express');
const router  = express.Router();
const { protect, authorise } = require('../middleware/auth');
const {
  getStats, getAllProperties, updatePropertyStatus, deleteProperty,
  getAllUsers, toggleUserStatus, deleteUser,
} = require('../controllers/adminController');

router.use(protect, authorise('admin')); // every admin route requires admin role

router.get('/stats',                      getStats);
router.get('/properties',                 getAllProperties);
router.put('/properties/:id/status',      updatePropertyStatus);
router.delete('/properties/:id',          deleteProperty);
router.get('/users',                      getAllUsers);
router.put('/users/:id/toggle',           toggleUserStatus);
router.delete('/users/:id',               deleteUser);

module.exports = router;
