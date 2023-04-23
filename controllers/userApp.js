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

exports.getProfile = async(req, res, next) => {
    const role = req.user.role;
    const contact = await Contact.findOne({user: req.user})
    const address = await Address.findOne({user: req.user})
    var post;
    if(role === 'student'){
        post = await StudentPost.find({user: req.userType})
    }
    else if(role === 'alumni'){
        post = await AlumniPost.find({user: req.userType})
    }
    res.render("userApp/profile", {
      user: req.userType,
      usermain: req.user,
      contact,
      address,
      post
    });
  };

exports.getEditProfile = async(req,res,next) =>{
    const contact = await Contact.findOne({user: req.user})
    const address = await Address.findOne({user: req.user})
    const dateString = req.userType.dob;
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${year.toString()}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    res.render("userApp/edit-details", {
        user: req.userType,
        role: req.user.role,
        address,
        contact,
        dob: formattedDate
    })
}
exports.postEditProfile = async(req,res,next)=> {
  const role = req.user.role;
  const firstname = req.body.firstName;
  const lastname = req.body.lastName;
  const age = req.body.age;
  const dob = req.body.dob;
  const email = req.body.email;
  const phone = req.body.phone;
  const instituteName = req.body.instituteName;
  const joinYear = req.body.joinYear;
  const passYear = req.body.passYear;
  const address = req.body.address;
  const city = req.body.city;
  const pincode = req.body.pinCode;
  const state = req.body.state;
  const country = req.body.country;
  const bio = req.body.bio;
  const profileImageUrl = req.body.profileImage;

  const contact = await Contact.findOne({user: req.user})
  contact.email = email;
  contact.phone = phone;
  await contact.save();

  const address_data = await Address.findOne({user: req.user})
  address_data.address = address;
  address_data.city = city;
  address_data.pincode = pincode;
  address_data.state = state;
  address_data.country = country;
  await address_data.save();

    if(role === "alumni"){
      const workplace = req.body.workplace;
      Alumni.findOne({user:req.user})
        .then(al=> {
            al.firstname = firstname
            al.lastname = lastname
            al.age = +age
            al.dob = new Date(dob)
            al.institute = instituteName
            al.joinYear = +joinYear
            al.passYear = +passYear
            al.bio = bio
            al.workplace = workplace
            al.imageUrl = profileImageUrl

            return al.save();
        })
        .then(result => {
            console.log('Details updated');
            res.redirect('/profile')
        })
        .catch(err => console.log(err))
    }
    
    else if(role === "student"){
        Student.findOne({user:req.user})
        .then(st=> {
            st.firstname = firstname
            st.lastname = lastname
            st.age = +age
            st.dob = new Date(dob)
            st.institute = instituteName
            st.joinYear = +joinYear
            st.passYear = +passYear
            st.bio = bio
            st.imageUrl = profileImageUrl

            return st.save();
        })
        .then(result => {
            console.log('Details updated');
            res.redirect('/profile')
        })
        .catch(err => console.log(err))
    }
}

