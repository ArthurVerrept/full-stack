const express = require('express');
const router = express.Router();

// render main page
router.get('/', (req, res) => res.render('welcome', {layout: 'main'}))

module.exports = router;

