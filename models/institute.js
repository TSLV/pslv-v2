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
    imageUrl: {
        type: String,
    },
    instituteList:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'instituteList'
    },
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

})


module.exports = mongoose.model('Institute', instituteSchema);