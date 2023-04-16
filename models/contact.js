const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    user:{
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
})

module.exports = mongoose.model('Contact', contactSchema);