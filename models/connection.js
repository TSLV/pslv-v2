const { model, Schema } = require("mongoose")

module.exports = model("connection", new Schema({
    users: {
        type: [Schema.Types.ObjectId],
        required: [true, "The user of the connection is required"],
        validate: {
            validator: (users) => users.length === 2,
            message: "Only 2 users can be connected with each other"
        }
    }
}))