const mongoose = require('mongoose');

const OutfitSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    Accessories: {
        type: String
    },
    Hats: {
        type: String
    },
    Outerwear: {
        type: String
    },
    Tops: {
        type: String
    },
    Bottoms: {
        type: String
    },
    FullBody: {
        type: String
    },
    Shoes: {
        type: String
    },
    ImageURL: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Outfit = mongoose.model('Outfit', OutfitSchema);

module.exports = Outfit;