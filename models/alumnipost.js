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
    postedby: {
        type: String,
        default: "alumni"
    },
    postResponse:{
        likes:{
            numLikes: {
                type: Number,
                default: 0,
            },
            users: [
                {
                    userId: {
                        type: Schema.Types.ObjectId,
                        required: true,
                        ref: "User",
                    }
                }
            ]
        },
    },
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Alumni'
    },
})

postSchema.methods.addLike = function(user){
    const userIndex = this.postResponse.likes.users.findIndex(us =>{
        return us.userId.toString() === user._id.toString();
    })
    if(userIndex<0){
        let numLikes = this.postResponse.likes.numLikes;
        numLikes+=1;
        const updatedUsers = [...this.postResponse.likes.users]
        updatedUsers.push({userId: user._id})
        this.postResponse.likes = {
            numLikes: numLikes,
            users: updatedUsers,
        }
        return this.save();
    }
    return this.save()
}

module.exports = mongoose.model('AlumniPost', postSchema);