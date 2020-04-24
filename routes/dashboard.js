const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const fs = require('fs');

const { ensureAuthenticated } = require('../config/auth')
var userID = '';

router.use(fileUpload());

const Item = require('../models/Clothes.js');
const Outfit = require('../models/Outfit.js');

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
    })
});

router.post('/addItem', (req,res) => {
    const {type, brand, itemName} =  req.body;

    const newItem = new Item({
        userID,
        type,
        brand,
        itemName,
    });

    newItem.save();

    req.flash('success_msg', 'Item Added!')
    res.redirect('/dashboard')
});

router.post('/addOutfit', (req,res) => {
    const Outfit = { };
    const fit = { Accessories, Hats, Outerwear, Tops, Bottoms, FullBody, Shoes } = req.body;

    // get key of values from fit object
    var fitKeys = Object.keys(fit)

    // get values from fit object
    var fitVals = Object.values(fit)

    // get length of fit object
    const fitSize = Object.getOwnPropertyNames(fit);


    // for every item in fit object
    for (let i = 0; i < fitSize.length; i++) {
        // if no clothing item was added
        if(fitVals[i] == 'none'){
            // value of fitVals array to object containing the key and none
            fitVals[i] = {[fitKeys[i]]: 'none'};
            console.log(fitVals[i])
        }
        // find item from name where ID matches loggin in user
        else{
            Item.findOne({userID: userID, itemName: fitVals[i]}, (err, docs) => {
                // set value to current key and item from db
                Outfit[i] = {[fitKeys[i]]: docs};
                console.log(Outfit[i])
            })
        }
    }

    


    // const newOutfit = new Outfit({
    //     userID,
    //     Accessories,
    //     Hats,
    //     Outerwear,
    //     Tops,
    //     Bottoms,
    //     FullBody,
    //     Shoes
    // });

    //console.log(newOutfit)
    //newOutfit.save();

    // // console.log(type, brand, itemName);
    // // console.log(userID);

    // req.flash('success_msg', 'Item Added!')
    // res.redirect('/dashboard')
});

module.exports = router;