const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    address: {
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    pincode:{
        type: Number,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
})

module.exports = mongoose.model('Address', addressSchema);