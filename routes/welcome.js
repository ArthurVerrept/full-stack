const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');
const Outfit = require('../models/Outfit.js');
const Item = require('../models/Clothes.js');
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

router.get('/p/:userName/:_id' , (req, res) => {
    if(req.user == undefined){
        var bool = false;
    } else {
        bool = true;
    }
    // extracting name and ID from URL
    var strName = url.parse(req.url).pathname
    var posName = strName.indexOf('/');
    var tempName = strName.splice(posName, 3, '');

    var idUse = tempName;

    // gets length of ID part of URL incase someone adds to it
    var useName = tempName;
    var posUseName = useName.indexOf('/');
    var idLength = useName.splice(0, posUseName, '');
    
    // gets name witout id to send to rendered page
    var posName2 = tempName.indexOf('/');
    var name = tempName.splice(posName2, idLength.length, '');


    var strID = idUse;
    var posID = strID.indexOf(`${name}`);
    var ID = strID.splice(posID, name.length + 1,'');


    User.find({userName: name}, (err, user) => {
    }).then((user) => {
        // if there is that user in db from url
        if(!user[0]){

            // INSERT ERROR PAGE HERE
            //console.log('user doesnt exists')

        } else{
            //console.log('user exists')
            if(ID.length != 24){

                // INSERT ERROR PAGE HERE
                //console.log('wrong length babay lol')
            }
            else{
                Outfit.find({_id: ID}, (err, outfitDocs) => { 
                }).then((fit)=>{
                    if(!fit[0]){
                        // INSERT ERROR PAGE HERE
                        //console.log('no fit lol')
                    } else {
                        res.render('public', {layout:'main', user: name, signIn: bool})
                    }
                });
            }
        }
    })
});

router.get('/p/:userName/:_id/getUserInfo' , (req, res) => {
    // extracting ID from URL
    var strName = url.parse(req.url).pathname
    var posName = strName.indexOf('/');
    var tempName = strName.splice(posName, 3, '');
    var strID = tempName;

    var posUserName = tempName.indexOf('/');
    var userName = tempName.splice(posUserName, 1000, '');

    var posID = strID.indexOf(`/`);
    var tempID = strID.splice(0, posID + 1,'');
    var posIDremove = tempID.indexOf(`/getUserInfo`);
    var ID = tempID.splice(posIDremove, 12,'');


User.find({userName: userName}, (err, user) => {})
.then((user)=> {
    Item.find({userID: user[0]._id}, (err, userItems) => {})
    .then((userItems) => {
        Outfit.findOne({_id: ID}, (err, user) => {})
        .then((outfit) => {
            fit = {};
            var keys = Object.keys(outfit._doc);
            var values = Object.values(outfit._doc);
            // for every item in the outfit
            for (let i = 0; i < keys.length; i++) {
                if(keys[i] != undefined && keys[i] != '_id' && keys[i] != 'userID' && keys[i] != 'userName' && keys[i] != 'date' && keys[i] != '__v' && keys[i] != undefined){
                    if(values[i] != 'none' && keys[i] != 'ImageURL'){
                        for (let x = 0; x < userItems.length; x++) {
                            if(userItems[x]._id == values[i]){
                                fit[keys[i]] = {
                                    brand: userItems[x].brand,
                                    itemName: userItems[x].itemName,
                                    type: userItems[x].type
                                };
                            }
                        }
                    } else if (keys[i] == 'ImageURL'){
                        fit[keys[i]] =  values[i];
                    } else {
                        fit[keys[i]] = {
                            brand: 'none',
                            itemName: 'none'
                        };
                    }
                }
            }
            fit['profileURL'] = user[0].ImageURL;
            fit['values'] = {
                clothes: userItems.length
            }
            res.send(fit)
        })
    })
})

});

router.get('/p/:userName/:_id/getUserPics' , (req, res) => {
     // extracting ID from URL
     var strName = url.parse(req.url).pathname
     var posName = strName.indexOf('/');
     var tempName = strName.splice(posName, 3, '');
     var strID = tempName;
 
     var posUserName = tempName.indexOf('/');
     var userName = tempName.splice(posUserName, 1000, '');

    Outfit.find({userName: userName}, (err, fits) => {})
    .then((fits)=>{
        var fitSend = []
        for (let i = 0; i < fits.length; i++) {
            fitSend.push({
                '_id': fits[i]._id,
                'ImageURL': fits[i].ImageURL,
                'userName': fits[i].userName
            });
        }
        res.json(fitSend)
    })

});
 



router.get('/p/:userName/:_id/getUserInfo' , (req, res) => {
    // extracting ID from URL
    var strName = url.parse(req.url).pathname
    var posName = strName.indexOf('/');
    var tempName = strName.splice(posName, 3, '');
    var strID = tempName;

    var posUserName = tempName.indexOf('/');
    var userName = tempName.splice(posUserName, 1000, '');

    var posID = strID.indexOf(`/`);
    var tempID = strID.splice(0, posID + 1,'');
    var posIDremove = tempID.indexOf(`/getUserInfo`);
    var ID = tempID.splice(posIDremove, 12,'');


User.find({userName: userName}, (err, user) => {})
.then((user)=> {
    Item.find({userID: user[0]._id}, (err, userItems) => {})
    .then((userItems) => {
        Outfit.findOne({_id: ID}, (err, user) => {})
        .then((outfit) => {
            fit = {};
            var keys = Object.keys(outfit._doc);
            var values = Object.values(outfit._doc);
            // for every item in the outfit
            for (let i = 0; i < keys.length; i++) {
                if(keys[i] != undefined && keys[i] != '_id' && keys[i] != 'userID' && keys[i] != 'userName' && keys[i] != 'date' && keys[i] != '__v' && keys[i] != undefined){
                    if(values[i] != 'none' && keys[i] != 'ImageURL'){
                        for (let x = 0; x < userItems.length; x++) {
                            if(userItems[x]._id == values[i]){
                                fit[keys[i]] = {
                                    brand: userItems[x].brand,
                                    itemName: userItems[x].itemName,
                                    type: userItems[x].type
                                };
                            }
                        }
                    } else if (keys[i] == 'ImageURL'){
                        fit[keys[i]] =  values[i];
                    } else {
                        fit[keys[i]] = {
                            brand: 'none',
                            itemName: 'none'
                        };
                    }
                }
            }
            fit['profileURL'] = user[0].ImageURL;
            res.send(fit)
        })
    })
})

});

router.get('/p/:userName/:_id/getUserItems' , (req, res) => {
    var strName = url.parse(req.url).pathname
    var posName = strName.indexOf('/');
    var tempName = strName.splice(posName, 3, '');
    var strID = tempName;

    var posUserName = tempName.indexOf('/');
    var userName = tempName.splice(posUserName, 1000, '');

    var posID = strID.indexOf(`/`);
    var tempID = strID.splice(0, posID + 1,'');
    var posIDremove = tempID.indexOf(`/getUserInfo`);
    var ID = tempID.splice(posIDremove, 12,'');

    User.find({userName: userName}, (err, user) => {})
    .then((user)=> {
        Item.find({userID: user[0]._id}, (err, fits) => {})
        .then((fits)=>{
            res.json(fits)
        })
    })
});
 

module.exports = router;

