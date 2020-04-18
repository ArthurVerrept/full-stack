const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
var userID = '';


// render main page
router.get('/', (req, res) => res.render('welcome', {layout: 'main'}))

// render dashboard view and using second parameter ensureauthenticated to make sure user is loggin in or not
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    userID = req.user._id;
    res.render('dashboard', {layout: 'main', name: req.user.name})
})

router.post('/dashboard', (req,res) => {
    console.log(req.body);
    console.log(userID);
    res.send('yo')
})

module.exports = router;

