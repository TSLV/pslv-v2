const { model, Schema } = require("mongoose");
const { CONNECTION_TYPES } = require("./utils");

module.exports = model("request", new Schema({
    from: {
        type: Schema.Types.ObjectId,
        required: [true, "The sender of the connection request is required"],
        ref: "User"
    },
    to: {
        type: Schema.Types.ObjectId,
        required: [true, "The receiver of the connection request is required"],
        ref: "User"
    },
    type: {
        type: String,
        enum: CONNECTION_TYPES,
        default: CONNECTION_TYPES[0]
    },
    message: String
}))