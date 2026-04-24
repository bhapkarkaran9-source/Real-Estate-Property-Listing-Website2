// routes/contact.js
const express = require('express');
const router  = express.Router();
const { protect, authorise } = require('../middleware/auth');
const { submitContact, getAllContacts, markResponded } = require('../controllers/contactController');

router.post('/',                    submitContact);           // open to all (even guests)
router.get('/',  protect, authorise('admin'), getAllContacts);
router.put('/:id/respond', protect, authorise('admin'), markResponded);

module.exports = router;
