const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require("../models/user");
const Address = require("../models/address");
const Alumni = require("../models/alumni");
const Student = require("../models/student");
const StudentPost = require("../models/studentpost");
const AlumniPost = require("../models/alumnipost");
const Contact = require("../models/contact");

exports.getIndex = (req, res, next) => {
  if(req.session.isLoggedIn){
    res.redirect('/home')
  }
  else{
    res.render("userApp/index");
  }
};

exports.getDashboard = async (req,res,next)=>{
    const userRole = req.user.role;
    const studentPost = await StudentPost.find().populate("user").exec();
    const alumniPost = await AlumniPost.find().populate("user").exec();

    const posts = [...studentPost, ...alumniPost];

    posts.sort((a,b)=>{
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    var likesArray = []
    for(var post of posts) {
        const temp1 = []
        for(var user of post.postResponse.likes.users) {
            const temp = await User.findById(user.userId)
            if(temp.role === "student") {
                temp1.push(await Student.findOne({ user: temp._id }))
            }
            else if(temp.role === "alumni"){
                temp1.push(await Alumni.findOne({ user: temp._id }))
            }
        }
        var commentDetails = []
        for(var comment of post.postResponse.comments){
            const textComment = comment.comment;
            const temp = await User.findById(comment.userId);
            if(temp.role === "student"){
                commentDetails.push({comment:textComment, commentUser: await Student.findOne({ user: temp._id })})
            }
            else if(temp.role === "alumni"){
                commentDetails.push({comment:textComment, commentUser: await Alumni.findOne({ user: temp._id })})
            }
        }
        likesArray.push({postDetails: post, userDetails: temp1, commentDetails})
        // likesArray.map(doc => doc.commentDetails.map(cmnt => ))
    }
    if(userRole === 'student'){
        const userStudent = await Student.findOne({user: req.user});
        res.render('userApp/home', {
            user: userStudent,
            role: userRole,
            posts: likesArray,
        });
    }
    else if(userRole === 'alumni'){
        const userAlumni = await Alumni.findOne({user: req.user});
        res.render('userApp/home', {
            user: userAlumni,
            role: userRole,
            posts: likesArray,
        });
    }

}
exports.postPost = (req,res,next)=>{
    const caption = req.body.caption;
    const imageUrl = req.body.imageUrl;
    const role = req.user.role;
    if(role === 'student'){
        Student.find({user: req.user})
            .then(student => {
                const post = new StudentPost({
                    caption: caption,
                    imageUrl: imageUrl,
                    postResponse: {likes:{numLikes: 0,users:[]},comments:[]},
                    user: student[0]._id,
                })
                post.save()
                    .then(result => {
                        console.log('posted successfully');
                        res.redirect('/home');
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))

    }
    else if(role === 'alumni'){
        Alumni.find({user: req.user})
            .then(alumni => {
                const post = new AlumniPost({
                    caption: caption,
                    imageUrl: imageUrl,
                    postResponse: {likes:{numLikes: 0,users:[]},comments:[]},
                    user: new ObjectId(alumni[0]._id)
                })
                post.save()
                    .then(result => {
                        console.log('posted successfully');
                        res.redirect('/home');
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

}

exports.postLikes = (req,res,next) => {
    const targetPost = req.body.targetPost;
    const postedby = req.body.postedby;
    if(postedby === 'student'){
        StudentPost.findById(targetPost)
            .then(stpost=>{
                return stpost.addLike(req.user)
            })
            .then(result => {
                res.redirect('/home')
            })
            .catch(err => console.log(err))
    }
    else if(postedby === 'alumni'){
        AlumniPost.findById(targetPost)
            .then(alpost=>{
                return alpost.addLike(req.user)
            })
            .then(result => {
                res.redirect('/home')
            })
            .catch(err => console.log(err))
    }
}

exports.postComments = (req,res,next) => {
    const targetPost = req.body.targetPost;
    const postedby = req.body.postedby;
    const comment = req.body.comment;
    if(postedby === 'student'){
        StudentPost.findById(targetPost)
            .then(stpost=>{
                return stpost.addComments(req.user,comment)
            })
            .then(result => {
                res.redirect('/home')
            })
            .catch(err => console.log(err))
    }
    else if(postedby === 'alumni'){
        AlumniPost.findById(targetPost)
            .then(alpost=>{
                return alpost.addComments(req.user,comment)
            })
            .then(result => {
                res.redirect('/home')
            })
            .catch(err => console.log(err))
    }
}

exports.getNetwork = (req, res, next) => {
  res.render("userApp/network", {
    user: req.userType,
  });
};

