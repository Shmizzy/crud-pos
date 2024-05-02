const { name } = require('ejs');
const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    addons: [String],
    img: String,
})

module.exports = mongoose.model('Item', itemSchema);
