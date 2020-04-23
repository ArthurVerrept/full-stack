const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const fs = require('fs');

const { ensureAuthenticated } = require('../config/auth')
var userID = '';

router.use(fileUpload());

const Item = require('../models/Clothes.js');

// render dashboard view and using second parameter ensureauthenticated to make sure user is loggin in or not
router.get('/', ensureAuthenticated, (req, res) => {
    userID = req.user._id;
    res.render('dashboard', {layout: 'main', name: req.user.name})
    //res.sendFile('/dashboard.html', {root: '/Users/mac/Desktop/Login/views'})
});


router.get('/getClothes', (req, res) => {
    // finding clothes where the userID in db is same as userID of logged in account
    Item.find({userID: userID}, (err, docs) => {
        res.json(docs);
        console.log(docs);
    })
});

router.post('/', (req,res) => {
    const {type, brand, itemName} =  req.body;

    const newItem = new Item({
        userID,
        type,
        brand,
        itemName,
    });

    newItem.save();

    // console.log(type, brand, itemName);
    // console.log(userID);

    req.flash('success_msg', 'Item Added!')
    res.redirect('/dashboard')
});

module.exports = router;