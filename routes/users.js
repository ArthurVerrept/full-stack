const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const config = require('../config/config');

cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.API_KEY,
    api_secret: config.API_SECRET
  });
    const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "clothing-users-app",
    allowedFormats: ["jpg", "png"]
  });
const parser = multer({ storage: storage });

// user model
const User = require('../models/Users.js');

//register page
router.get('/register', (req, res) => res.render('register', {layout: 'main'}))

router.post('/register', parser.any(), (req, res) =>{
    // get post request
    const {name, email, userName, password, password2} =  req.body;

    //errors array
    let errors = [];

    // Check required fields are full
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Please fill in all fields' })
    }

    if(userName.includes(' ') == true){
        errors.push({ msg: 'Username cannot contain spaces' })
    }

    //check passwords match
    if(password != password2){
        errors.push({ msg: 'Passwords do not match' })
    }

    //check password length
    if(password.length < 6){
        errors.push({ msg: 'Passwords should be at least 6 characters' })
    }

    // if any errors in array
    if(errors.length > 0){
        // render the page with errors and input values back into form 
        res.render('register', {layout: 'main', errors:errors, nameholder:name, usernameholder: userName, emailholder: email});
    } else {
        User.findOne({ $or:[{ email: email }, {userName, userName}]})
        .then(user => {
            if(user){
                // if email exists
                errors.push({ msg: 'Username or Email already in use ' });
                res.render('register', {layout: 'main', errors:errors, nameholder:name, usernameholder: userName, emailholder: email});
            } 
            else {
                const newUser = new User({
                    name,
                    userName,
                    email,
                    password,
                    ImageURL: req.files[0].url
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
                            res.redirect('/')
                        })
                        .catch(err => console.log(err))
                }))
            }
        })
    }

})

// login post route
router.post('/login', (req, res, next) =>{
    try {
        // calling passport
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: true
        })(req, res, next);
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
});

// logout handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'you are logged out');
    res.redirect('/')
})

module.exports = router;

