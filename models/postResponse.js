const { model, Schema } = require("mongoose")


const postResponseSchema = new Schema ({
    likes:{
        type: Number,
    },
    comments:[
        {
            userId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "User",
            },
            comment: {
                type: String,
                required: true,
            } 
        }
    ],
    postId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Post",
    }
})

module.exports = model("Post-Response", postResponseSchema)