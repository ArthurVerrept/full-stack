const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');
const { ensureAuthenticated } = require('../config/auth')

// render main page
router.get('/', (req, res) => {
    // checking through deserializeUser if user exists
    // if(req.user != 'undefined' && req.user != null){
    //     // if user exists redirect to dashboard
    //     res.redirect('/dashboard');
    // } else {
        // else render page as usual
        if(req.user == undefined){
            var bool = false;
        } else {
            bool = true;
        }
        res.render('welcome', {layout: 'main', signIn: bool})
    // }
})

module.exports = router;

