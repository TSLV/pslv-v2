const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instituteSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    instType:{
        type: String,
        required: true,
    },
    address:{
        addressId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Address'
        }
    },
    contact:{
        contactId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Contact'
        }
    },
    user:{
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }

})


module.exports = mongoose.model('Institute', instituteSchema);