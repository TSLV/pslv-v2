const { model, Schema } = require("mongoose")


module.exports = model("Institute-List", new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
}))