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
    bio:{
        type: String,
    },
    address:{
        addressId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Address'
        }
    },
    imageUrl: {
        type: String,
    },
    contact:{
        contactId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Contact'
        }
    },
    instituteList:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'instituteList'
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