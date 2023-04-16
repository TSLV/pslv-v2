const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    caption:{
        type: String,
    },
    timestamp: {
        type: String,
        default: new Date(Date.now())
    },
    imageUrl: {
        type: String,
    },
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = mongoose.model('Post', postSchema);