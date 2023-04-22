const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/user')
const Address = require('../models/address')
const Alumni = require('../models/alumni')
const Student = require('../models/student')
const Post = require('../models/post')
const Contact = require('../models/contact')

exports.getIndex = (req,res,next)=>{
    res.render('userApp/index');
}

exports.getDashboard = (req,res,next)=>{
    const role = req.user.role;
    if(role === "student"){
        Student.findOne({user: req.user})
        .then(student => {
            Post.find()
                .then(posts=>{
                    res.render('userApp/home', {
                        user: student,
                        role: role,
                        posts: posts
                    });
                })
                .catch(err=>{
                    console.log(err);
                })   
        })
        .catch(err=>{
            console.log(err);
        })
    }
    else if(role === "alumni"){
        Alumni.findOne({user: req.user})
        .then(alumni => {
            res.render('userApp/home', {
                user: alumni,
                role: role
            });
        })
    }
}
exports.postPost = (req,res,next)=>{
    const caption = req.body.caption;
    const imageUrl = req.body.imageUrl;

    const post = new Post({
        caption: caption,
        imageUrl: imageUrl,
        user: req.user
    })
    post.save()
        .then(result => {
            console.log('posted successfully');
            res.redirect('/home');
        })
        .catch(err => console.log(err)) 
}
exports.getNetwork = (req,res,next)=>{
    res.render('userApp/network', {
        user: req.user,
    });
}