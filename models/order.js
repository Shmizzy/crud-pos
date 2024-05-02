const mongoose = require('mongoose');
const Item = require('./models/item.js');



const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    payedStatus: {
        type: Boolean,
        required: true,
    },
    order: [ ]
});


module.exports = mongoose.model('Order', orderSchema);