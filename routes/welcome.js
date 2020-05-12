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
            console.log('user doesnt exists')

        } else{
            console.log('user exists')
            if(ID.length != 24){

                // INSERT ERROR PAGE HERE
                console.log('wrong length babay lol')
            }
            else{
                Outfit.find({_id: ID}, (err, outfitDocs) => { 
                }).then((fit)=>{
                    if(!fit[0]){
                        
                        // INSERT ERROR PAGE HERE
                        console.log('no fit lol')
                    } else {
                        console.log(' fit exists')
                    }
                });
            }
        }
    })
    res.render('public', {layout:'main', user: name})
});

router.get('/p/:userName/:_id/getUserInfo' , (req, res) => {
    // extracting name and ID from URL
    var strName = url.parse(req.url).pathname
    var posName = strName.indexOf('/');
    var tempName = strName.splice(posName, 3, '');

    var idUse = tempName;
    var strID = idUse;
    var posID = strID.indexOf(`${name}`);
    var ID = strID.splice(posID, name.length + 1,'');
//     var str = url.parse(req.url).pathname
//     var pos = str.indexOf('/');
//     var tempName = str.splice(pos, 3, '');
    
//     var pos2 = tempName.indexOf('/g');
//     var name = tempName.splice(pos2, 12, '');

//     //console.log(name);
//     User.find({userName: name}, (err, user) => {})
//     .then((user)=>{
//     var userInf = user[0];
//     var outfitIDs =[];
//     var outfitKeys =[];

//     var JSONsend = [];
//     Item.find({userID: userInf._id}, (err, docs) => {
//     //console.log(docs)
//     }).then((itemDocs) => { 
//         Outfit.find({userID: userInf._id}, (err, outfitDocs) => { 
//             for (let i = 0; i < outfitDocs.length; i++) {
//                 outfitIDs.push(Object.values(outfitDocs[i]._doc)) 
//                 outfitKeys.push(Object.keys(outfitDocs[i]._doc)) 
//             }
    
//             // for every outfit
//             for (let x = 0; x < outfitDocs.length; x++) {
//                 var tempArray = [];
//                 // look through every item id to match to item of clothing
//                 for (let y = 0; y < outfitKeys[0].length; y++) {
//                     if(outfitKeys[x][y] == '_id' || outfitKeys[x][y] == 'userID' || outfitKeys[x][y] == '__v' || outfitKeys[x][y] == 'date'){
//                         //console.log('not one we want')
//                     }
//                     else if(outfitKeys[x][y] == 'ImageURL') {
//                         tempArray.push({URL: outfitIDs[x][y]});
//                     }
//                     else if(outfitIDs[x][y] == 'none') {
//                         tempArray.push({type: outfitKeys[x][y], itemName: 'none'});
//                     }
//                     else {
//                         for (let z = 0; z < itemDocs.length; z++) {
//                         if(itemDocs[z]._id.toString() == outfitIDs[x][y]){
//                                 tempArray.push(itemDocs[z]);
//                         }
//                         } 
//                     }
//                 }
//                 JSONsend[x] = tempArray
//             }
//             console.log(JSONsend)
//             res.json(JSONsend)
//         })
//         .catch(err=>console.log(err))
//     })
// })
})

module.exports = router;

