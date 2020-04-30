const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const fs = require('fs');

const { ensureAuthenticated } = require('../config/auth')

router.use(fileUpload());

const Item = require('../models/Clothes.js');
const Outfit = require('../models/Outfit.js');

// render dashboard view and using second parameter ensureauthenticated to make sure user is loggin in or not
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {layout: 'main', name: req.user.name})
    //res.sendFile('/dashboard.html', {root: '/Users/mac/Desktop/Login/views'})
});


router.get('/getClothes', (req, res) => {
    // finding clothes where the userID in db is same as req.user._id of logged in account taken from token
    Item.find({userID: req.user._id}, (err, docs) => {
        res.json(docs);
    }).catch(err=>console.log(err))
});

router.post('/addItem', (req,res) => {
    const {type, brand, itemName} =  req.body;

    const newItem = new Item({
        userID: req.user._id,
        type,
        brand,
        itemName,
    });

    newItem.save();

    req.flash('success_msg', 'Item Added!')
    res.redirect('/dashboard')
});

router.post('/addOutfit', (req,res) => {
    const sendFit = { }
    const fit = { Accessories, Hats, Outerwear, Tops, Bottoms, FullBody, Shoes } = req.body;

    // get values from fit object
    var fitVals = Object.values(fit)

    var fitKeys = Object.keys(fit)

    // find all items from name and only from currently logged in user
    Item.find({userID: req.user._id, itemName: fitVals})
    .then((docs)=> {
        // loop through retrieved items of clothing
        for (let index = 0; index < docs.length; index++) {
            // for each item retrieved, loop through each possible type of clothing
            for (let x = 0; x < fitKeys.length; x++) {
                // only search through types if value has not been previously set in loop
                if(sendFit[fitKeys[x]] == 'none' || sendFit[fitKeys[x]] == undefined){
                    // if type of clothing matches current key from key list
                    if(docs[index].type == fitKeys[x]){
                        // set send fit object to have current key and ID of item with matching type
                        sendFit[fitKeys[x]] = docs[index]._id
                    } else {
                        // if they do not match set key to have ID of none
                        sendFit[fitKeys[x]] = 'none'
                    }
                }
            }
        }

        const newOutfit = new Outfit({
            userID: req.user._id,
            Accessories: sendFit.Accessories,
            Hats: sendFit.Hats,
            Outerwear: sendFit.Outerwear,
            Tops: sendFit.Tops,
            Bottoms: sendFit.Bottoms,
            FullBody: sendFit.FullBody,
            Shoes: sendFit.Shoes
        });
        newOutfit.save();
    }).catch(err=>console.log(err))


       

    

    

    //console.log(newOutfit)
    //newOutfit.save();

    // // console.log(type, brand, itemName);
    // // console.log(userID);

    // req.flash('success_msg', 'Item Added!')
    // res.redirect('/dashboard')
});

module.exports = router;