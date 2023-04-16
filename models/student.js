const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    firstname:{
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true,
    },
    dob:{
        type: Date,
        required: true,
    },
    joinYear:{
        type: Number,
        required: true,
    },
    passYear:{
        type: Number,
        required: true,
    },
    address:{
        addressId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Address'
        }
    },
    institute:{
        instituteId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Institute'
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


module.exports = mongoose.model('Institute', studentSchema);