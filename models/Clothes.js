const mongoose = require('mongoose');

const ClothesSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Clothes = mongoose.model('Clothes', ClothesSchema);

module.exports = Clothes;