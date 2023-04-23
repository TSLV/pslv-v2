const { model, Schema } = require("mongoose")


const postResponseSchema = new Schema ({
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
    // comments:[
    //     {
    //         userId: {
    //             type: Schema.Types.ObjectId,
    //             required: true,
    //             ref: "User",
    //         },
    //         comment: {
    //             type: String,
    //             required: true,
    //         } 
    //     }
    // ],
    postId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "StudentPost",
    }
})
postResponseSchema.methods.addLike = function(user){
    const userIndex = this.users.findIndex(us =>{
        return us.userId.toString() === user._id.toString();
    })
    if(userIndex<0){
        const numLikes = this.likes.numLikes;
        numLikes+=1;
        const updatedUsers = [...this.likes.users]
        updatedUsers.push({userId: user})
        this.likes = {
            numLikes: numLikes,
            users: updatedUsers,
        }
        return this.save();
    }
}
module.exports = model("StudentPostResponse", postResponseSchema)