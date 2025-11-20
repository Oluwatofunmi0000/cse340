const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the public directory (css, js, images)
router.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = router;



