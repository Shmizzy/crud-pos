const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    order: {
        type: Object,
        require: true,
    }
});


module.exports = mongoose.model('Order', orderSchema);