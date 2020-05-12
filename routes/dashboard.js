const express = require('express');
const multer = require("multer");
const router = express.Router();
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

const { ensureAuthenticated } = require('../config/auth')

const Item = require('../models/Clothes.js');
const User = require('../models/Users.js');
const Outfit = require('../models/Outfit.js');

// render dashboard view and using second parameter ensureauthenticated to make sure user is loggin in or not
router.get('/', ensureAuthenticated, (req, res) => {
    console.log(req.user)
    // else render page as usual
    if(req.user == undefined){
        var bool = false;
    } else {
        bool = true;
    }
    res.render('dashboard', {layout: 'main', name: req.user.name, signIn: bool})
    //res.sendFile('/dashboard.html', {root: '/Users/mac/Desktop/Login/views'})
});


router.get('/getClothes', (req, res) => {
    // finding clothes where the userID in db is same as req.user._id of logged in account taken from token
    Item.find({userID: req.user._id}, (err, docs) => {
        res.json(docs);
    }).catch(err=>console.log(err))
});

router.get('/getOutfits', (req, res) => {
var outfitIDs =[];
var outfitKeys =[];

var JSONsend = [];
    Item.find({userID: req.user._id}, (err, docs) => {
    }).then((itemDocs) => { 
        Outfit.find({userID: req.user._id}, (err, outfitDocs) => { 
            for (let i = 0; i < outfitDocs.length; i++) {
                outfitIDs.push(Object.values(outfitDocs[i]._doc)) 
                outfitKeys.push(Object.keys(outfitDocs[i]._doc)) 
            }
    
            // for every outfit
            for (let x = 0; x < outfitDocs.length; x++) {
                var tempArray = [];
                // look through every item id to match to item of clothing
                for (let y = 0; y < outfitKeys[0].length; y++) {
                    if(outfitKeys[x][y] == '_id' || outfitKeys[x][y] == 'userID' || outfitKeys[x][y] == '__v' || outfitKeys[x][y] == 'date'){
                        //console.log('not one we want')
                    }
                    else if(outfitKeys[x][y] == 'ImageURL') {
                        tempArray.push({URL: outfitIDs[x][y]});
                    }
                    else if(outfitIDs[x][y] == 'none') {
                        tempArray.push({type: outfitKeys[x][y], itemName: 'none'});
                    }
                    else {
                        for (let z = 0; z < itemDocs.length; z++) {
                           if(itemDocs[z]._id.toString() == outfitIDs[x][y]){
                                tempArray.push(itemDocs[z]);
                           }
                        } 
                    }
                }
                JSONsend[x] = tempArray
            }
            res.send(JSONsend)
        })
        .catch(err=>console.log(err))
    })
})

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

router.post('/addOutfit', parser.any(), (req,res) => {
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
            userName: req.user.userName,
            Accessories: sendFit.Accessories,
            Hats: sendFit.Hats,
            Outerwear: sendFit.Outerwear,
            Tops: sendFit.Tops,
            Bottoms: sendFit.Bottoms,
            FullBody: sendFit.FullBody,
            Shoes: sendFit.Shoes,
            ImageURL: req.files[0].url
        });
        newOutfit.save();
    })
    .then(() => {res.redirect('/dashboard')})
    .catch(err=>console.log(err));
});


router.get('/getAllOutfits', (req, res) => {
    Outfit.find({}, (err, allOutfits) => { 
        res.send(allOutfits)
    })
    .catch(err=>console.log(err))
});

module.exports = router;