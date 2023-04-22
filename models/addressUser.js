const { model, Schema } = require("mongoose")

module.exports = model("Address-User", new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    address: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Address'
    }
}))