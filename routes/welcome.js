const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');
const { ensureAuthenticated } = require('../config/auth')
var url = require('url');

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

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

router.get('/p/:userName' , (req, res) => {
    var str = url.parse(req.url).pathname
    var pos = str.indexOf('/');
    var name = str.splice(pos, 3, '');
    User.find({userName: name})
    .then((user)=>{
        res.send(user)
    })
    // checking through deserializeUser if user exists
    // if(req.user != 'undefined' && req.user != null){
    //     // if user exists redirect to dashboard
    // //     res.redirect('/dashboard');
    // // } else {
    //     // else render page as usual
    //     if(req.user == undefined){
    //         var bool = false;
    //     } else {
    //         bool = true;
    //     }
    //     res.render('welcome', {layout: 'main', signIn: bool})
    // // }
})


module.exports = router;

