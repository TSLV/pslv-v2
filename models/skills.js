const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    skills:[
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

skillSchema.methods.addSkill = function(skill){
    const skills = [...this.skills]
    skills.push(skill);
    this.skills = skills;
    return this.save();
}

module.exports = mongoose.model('Skill', skillSchema);