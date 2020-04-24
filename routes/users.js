const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')

// user model
const User = require('../models/Users.js');

//login page
router.get('/login', (req, res) => res.render('login', {layout: 'main'}))

//register page
router.get('/register', (req, res) => res.render('register', {layout: 'main'}))

router.post('/register', (req, res) =>{
    // get post request
    const {name, email, password, password2} =  req.body;

    //errors array
    let errors = [];

    // Check required fields are full
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'please fill in all fields' })
    }

    //check passwords match
    if(password != password2){
        errors.push({ msg: 'passwords do not match' })
    }

    //check password length
    if(password.length < 6){
        errors.push({ msg: 'passwords should be at least 6 characters' })
    }

    // if any errors in array
    if(errors.length > 0){
        // render the page with errors and input values back into form 
        res.render('register', {layout: 'main', errors:errors, nameholder:name, emailholder: email});
    } else {
        User.findOne({ email: email })
        .then(user => {
            if(user){
                // if email exists
                errors.push({ msg: ' Email already in use ' });
                res.render('register', {layout: 'main', errors:errors, nameholder:name, emailholder: email});
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                // hash password
                // adding salt to end of password for added security and then hashing
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err){throw err};
                        newUser.password = hash;
                        newUser.save()
                        .then(()=>{
                            // using success_msg from app.js
                            req.flash('success_msg', 'you are now registered')
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err))
                }))
            }
        })
    }

})

// login post route
router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// logout handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'you are logged out');
    res.redirect('/users/login')
})

module.exports = router;

