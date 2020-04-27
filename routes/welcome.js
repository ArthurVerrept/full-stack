const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');
const { ensureAuthenticated } = require('../config/auth')

// render main page
router.get('/', (req, res) => {
    console.log(req.user)
    if(req.user != 'undefined' && req.user != null){
        res.redirect('/dashboard');
    } else {
        res.render('welcome', {layout: 'main'})
    }
})

module.exports = router;

