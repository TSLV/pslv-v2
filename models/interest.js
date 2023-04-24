const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interestSchema = new Schema({
    interests:[
        {
            type:String,
        }
    ],
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

interestSchema.methods.addInterest = function(interest){
    const interests = [...this.interests]
    interests.push(interest);
    this.interests = interests;
    return this.save();
}

module.exports = mongoose.model('Interest', interestSchema);