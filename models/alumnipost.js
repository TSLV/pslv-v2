const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    timestamp: {
        type: String,
        default: new Date(Date.now())
    },
    caption:{
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Alumni'
    },
})

module.exports = mongoose.model('AlumniPost', postSchema);