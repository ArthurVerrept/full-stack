const express = require('express');
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
var url = require('url');

const config = require('../config/config');

// connects to my cloudinary cloud storage
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
// creates instance of multer to send file to cloudinary
const parser = multer({ storage: storage });

const { ensureAuthenticated } = require('../config/auth')

const Item = require('../models/Clothes.js');
const User = require('../models/Users.js');
const Outfit = require('../models/Outfit.js');

// render dashboard view and using second parameter ensureauthenticated to make sure user is loggin in or not
router.get('/', ensureAuthenticated, (req, res) => {
    // if user isnt signed in
    if(req.user == undefined){
        var bool = false;
    // if user is is signed in
    } else {
        bool = true;
    }
    // render dashboard sending username name and image url for profile image
    res.render('dashboard', {layout: 'main', userName: req.user.userName, name:req.user.name, signIn: bool, img: req.user.ImageURL})
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
            // put id's and values into seperate arrays
            for (let i = 0; i < outfitDocs.length; i++) {
                outfitIDs.push(Object.values(outfitDocs[i]._doc)) 
                outfitKeys.push(Object.keys(outfitDocs[i]._doc)) 
            }
    
            // for every outfit
            for (let x = 0; x < outfitDocs.length; x++) {
                var tempArray = [];
                // look through every item id to match to item of clothing
                for (let y = 0; y < outfitKeys[0].length; y++) {
                    if(outfitKeys[x][y] == 'userID' || outfitKeys[x][y] == '__v' || outfitKeys[x][y] == 'date'){
                        // no need for these things
                    }
                    // else add to temparray
                    else if(outfitKeys[x][y] === 'ImageURL') {
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
                // add id of outfit to be added to delete
                if(outfitKeys[x][0] == '_id') {
                    tempArray.push({ID: outfitIDs[x][0]});
                }
                // save array within array in position x 
                JSONsend[x] = tempArray
            }
            // send array of arrays
            res.send(JSONsend)
        })
        .catch(err=>console.log(err))
    })
})

router.post('/addItem', (req,res) => {
    // get data from front end into an object
    const {type, brand, itemName} =  req.body;

    // add userID from user signed in
    const newItem = new Item({
        userID: req.user._id,
        type,
        brand,
        itemName,
    });

    // save to db
    newItem.save();

    // confirmation message and redirect
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

        // create object to send
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
        //save to db
        newOutfit.save();
    })
    .then(() => {
        // confirmation message and redirect
        req.flash('success_msg', 'Outfit Added!')
        res.redirect('/dashboard')
    })
    .catch(err=>console.log(err));
});


router.get('/getAllOutfits', (req, res) => {
    Outfit.find({}, (err, allOutfits) => { 
        res.send(allOutfits)
    })
    .catch(err=>console.log(err))
});


router.get('/deleteOutfit/:id', (req, res) => {
    var strName = url.parse(req.url).pathname
    var posName = strName.indexOf('/');
    var ID = strName.splice(posName, 14, '');
    // if user not signed in
    if(req.user){
        // find outfit to delete
        Outfit.findOne({_id:ID}, (err, outfit) => { 
            // if no outfit
            if(outfit == undefined || outfit == null){
                // redirect to dashboard
                res.redirect('/dashboard');
            // if there is an outfit
            } else {
                //check if the outfit belongs to user signed in
                if(req.user._id == outfit.userID){
                    Outfit.deleteOne({_id:ID}, (err, outfit) => { 
                        res.redirect('/dashboard');
                    })
                    .catch(err=>console.log(err))
                // if not belonging to signed in user account redirect
                } else {
                    res.redirect('/dashboard');
                }
            }
        });
    // if user no signed in redirect
    } else{
        res.redirect('/')
    }


});

module.exports = router;