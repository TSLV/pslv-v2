const { model, Schema } = require("mongoose")


module.exports = model("institute-list", new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
}))