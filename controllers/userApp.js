const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require("../models/user");
const Address = require("../models/address");
const Alumni = require("../models/alumni");
const Student = require("../models/student");
const StudentPost = require("../models/studentpost");
const AlumniPost = require("../models/alumnipost");
const Contact = require("../models/contact");
const Skills = require("../models/skills");
const Interests = require("../models/interest");
const About = require("../models/about");
const Job = require("../models/job");
const { Tokenizer } = require("../utils");
const request = require("../models/request");
const connection = require("../models/connection");

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
    const connections = await connection.find({ users: { $in: [req.user._id]}}).populate("users").exec()
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
    const users = []
    const connectedUsers = []
    for(const connection of connections) {
        for(const user of connection.users) {
            if(!connectedUsers.includes(user._id) && String(user._id) !== String(req.user._id)) {
                connectedUsers.push(user._id)
            }
        }
    }
    users.push(...(await Student.find({ user: {$ne: req.user._id, $nin: connectedUsers }}).limit(4).exec()))
    users.push(...(await Alumni.find({ user: {$ne: req.user._id, $nin: connectedUsers  }}).limit(4).exec()))
    if(userRole === 'student'){
        const userStudent = await Student.findOne({user: req.user});
        res.render('userApp/home', {
            user: userStudent,
            role: userRole,
            posts: likesArray,
            users: Tokenizer.shuffle(users),
            connection:connections.length
        });
    }
    else if(userRole === 'alumni'){
        const userAlumni = await Alumni.findOne({user: req.user});
        res.render('userApp/home', {
            user: userAlumni,
            role: userRole,
            posts: likesArray,
            users: Tokenizer.shuffle(users),
            connection:connections.length
        });
    }
    
}

exports.getEditPost = async (req,res,next)=>{
    const userRole = req.user.role;
    let posts = []
    if(userRole === 'student'){
        posts = await StudentPost.find({user:req.userType}).populate("user").exec();
    }
    else if(userRole === 'alumni'){
        posts = await AlumniPost.find({user:req.userType}).populate("user").exec();
    }

    // const posts = [...studentPost, ...alumniPost];

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

    const users = []
    users.push(...(await Student.find({ user: {$ne: req.user._id }}).limit(4).exec()))
    users.push(...(await Alumni.find({ user: {$ne: req.user._id }}).limit(4).exec()))
    if(userRole === 'student'){
        const userStudent = await Student.findOne({user: req.user});
        res.render('userApp/edit-post', {
            user: userStudent,
            role: userRole,
            posts: likesArray,
            users: Tokenizer.shuffle(users)
        });
    }
    else if(userRole === 'alumni'){
        const userAlumni = await Alumni.findOne({user: req.user});
        res.render('userApp/edit-post', {
            user: userAlumni,
            role: userRole,
            posts: likesArray,
            users: Tokenizer.shuffle(users)
        });
    }
    
}

exports.postEditPost = async(req,res,next) => {
    const targetPost = req.body.targetPost;
    const postedby = req.body.postedby;
    console.log(targetPost);
    if(postedby === 'student'){
        StudentPost.findByIdAndRemove(targetPost)
            .then(stpost=>{
                res.redirect('/edit-posts')
            })
            .catch(err => console.log(err))
    }
    else if(postedby === 'alumni'){
        AlumniPost.findByIdAndRemove(targetPost)
            .then(result => {
                res.redirect('/edit-posts')
            })
            .catch(err => console.log(err))
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

exports.getNetwork = async (req, res, next) => {
    let requests = await request.find({ type: "MUTUAL", to: req.user._id }).populate(["from", "to"]).exec()
    const connections = await connection.find({ users: { $in: [req.user._id]}}).populate("users").exec()
    const connectionData = {
        students: [],
        alumni: []
    }
    connections.forEach(connection => {
        for(const user of connection.users) {
            if(user.role === "alumni" && !connectionData.alumni.includes(user._id)) {
                connectionData.alumni.push(user._id)
            }
            if(user.role === "student" && !connectionData.students.includes(user._id)) {
                connectionData.students.push(user._id)
            }
            if(user.role === "alumni" && !connectionData.alumni.includes(user._id)) {
                connectionData.alumni.push(user._id)
            }
            if(user.role === "student" && !connectionData.students.includes(user._id)) {
                connectionData.students.push(user._id)
            }
        }
    })
    const connectedUsers = []
    connectedUsers.push(...(await Student.find({ user: { $in: connectionData.students, $ne: req.user._id }})))
    connectedUsers.push(...(await Alumni.find({ user: { $in: connectionData.alumni, $ne: req.user._id }})))
    const alumni = []
    const students = []
    requests.forEach(request => {
        if(request.from.role === "alumni" && !alumni.includes(request.from._id)) {
            alumni.push(request.from._id)
        }
        if(request.from.role === "student" && !students.includes(request.from._id)) {
            students.push(request.from._id)
        }
        if(request.to.role === "alumni" && !alumni.includes(request.to._id)) {
            alumni.push(request.to._id)
        }
        if(request.to.role === "student" && !students.includes(request.to._id)) {
            students.push(request.to._id)
        }
    })
    const alumniData = []
    const studentsData = []
    if(alumni.length) {
       alumniData.push(...(await Alumni.find({ user: { $in: alumni }})))
    }
    if(students.length) {
        studentsData.push(...(await Student.find({ user: { $in: students }})))
    }
    const requestData = []
    requests.forEach(__request => {
        let request = __request._doc
        if(request.from.role === "alumni") {
            request.from = {...request.from._doc, data: alumniData.filter((e) => String(e.user) === String(request.from._id))[0]}
        }
        if(request.to.role === "alumni") {
            request.to = {...request.to._doc, data: alumniData.filter((e) => String(e.user) === String(request.to._id))[0]}
        }
        if(request.from.role === "student") {
            request.from = {...request.from._doc, data: studentsData.filter((e) => String(e.user) === String(request.from._id))[0]}
        }
        if(request.to.role === "student") {
            request.to = {...request.to._doc, data: studentsData.filter((e) => String(e.user) === String(request.to._id))[0]}
        }
        requestData.push(request)
    })
    const suggestions = []
    const temp = []
    for(const connection of connections) {
        for(const user of connection.users) {
            if(!temp.includes(user._id) && String(user._id) !== String(req.user._id)) {
                temp.push(user._id)
            }
        }
    }
    suggestions.push(...(await Student.find({ user: { $ne: req.user._id, $nin: temp }})))
    suggestions.push(...(await Alumni.find({ user: { $ne: req.user._id, $nin: temp }})))
    res.render("userApp/network", {
        user: req.userType,
        requests: requestData,
        suggestions,
        connectedUsers
    });
};

exports.getProfile = async(req, res, next) => {
    let user = req.user
    let userType = req.userType
    if(req.params.userId) {
        user = await User.findById(req.params.userId)
        userType = await (user.role==="student"?Student:Alumni).findOne({ user: user._id})
    }
    const role = user.role;
    const about = await About.findOne({user: user._id});
    const aboutData = about ? about.about : ''
    const contact = await Contact.findOne({user: user._id})
    const address = await Address.findOne({user: user._id})
    const skillsData = await Skills.findOne({user: user._id})
    const skills = skillsData ? skillsData.skills : [];
    const interestData = await Interests.findOne({user: user._id})
    const interests = interestData ? interestData.interests : [];
    var post;
    if(role === 'student'){
        post = await StudentPost.find({ user: userType._id })
    }
    else if(role === 'alumni'){
        post = await AlumniPost.find({ user: userType._id })
    }
    const users = []
    users.push(...(await Student.find({ user: {$ne: req.user._id }}).limit(4).exec()))
    users.push(...(await Alumni.find({ user: {$ne: req.user._id }}).limit(4).exec()))
    
    const connections = await connection.find({ users: { $in: [req.user._id]}}).populate("users").exec()
    

    var postImpression = 0;
    for(var i of post){
        postImpression += i.postResponse.likes.numLikes + i.postResponse.comments.length;
    }
    res.render("userApp/profile", {
      user: userType,
      usermain: user,
      contact,
      address,
      post,
      skills,
      interests,
      others: req.params.userId ? true : false,
      users,
      postImpression,
      connection: connections.length,
      aboutData
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

exports.postSkill = async(req,res,next)=>{
    const skills = await Skills.findOne({user: req.user})
    const newSkill = req.body.skill;
    if(skills){
        await skills.addSkill(newSkill);
        res.redirect('/profile')
    }
    else{
        const skillData = new Skills({
            skills: [newSkill],
            user: new ObjectId(req.user)
        })
        await skillData.save();
        res.redirect('/profile');
    }
}

exports.postInterest = async(req,res,next)=>{
    const interests = await Interests.findOne({user: req.user})
    const newInterest = req.body.skill;
    if(interests){
        await interests.addInterest(newInterest);
        res.redirect('/profile')
    }
    else{
        const interestData = new Interests({
            interests: [newInterest],
            user: new ObjectId(req.user)
        })
        await interestData.save();
        res.redirect('/profile');
    }
}

exports.getAdmin = async(req,res,next) =>{
    try {
        res.render("userApp/admin");
    } catch (error) {
        console.log(error);
    }
   
}
exports.postAbout = async(req,res,next)=>{
    const about = await About.findOne({user: req.user})
    const newAbout = req.body.about
    if(about){
        about.about = newAbout;
        await about.save();
        res.redirect('/profile');
    }
    else{
        const aboutData = new About({
            about: newAbout,
            user: new ObjectId(req.user)
        })
        await aboutData.save();
        console.log('about posted');
        res.redirect('/profile');
    }
}

exports.getNotification = async(req,res,next)=>{
    const studentPost = await StudentPost.find().populate("user").exec();
    const alumniPost = await AlumniPost.find().populate("user").exec();

    const posts = [...studentPost, ...alumniPost];
    posts.sort((a,b)=>{
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    res.render('userApp/notifications',{
        user: req.userType,
        posts: posts,
    });
}
exports.getJobs = async(req,res,next) => {
    const jobs = await Job.find({user: req.user})
    res.render('userApp/jobs',{
        user: req.userType,
        usermain: req.user,
        jobs
    })
}

exports.postJobs = async(req,res,next) => {
    const title = req.body.jobtitle;
    const companyname = req.body.companyname;
    const jobdescription = req.body.jobdescription;
    const joblocation = req.body.joblocation;
    const jobtype = req.body.jobtype;
    const jobsalary = req.body.jobsalary;
    const jobskills = req.body.jobskills;

    const job = new Job({
        title: title,
        companyname: companyname,
        description: jobdescription,
        location: joblocation,
        type: jobtype,
        salary: jobsalary,
        skills: jobskills,
        user: new ObjectId(req.user)
    })
    await job.save();
    res.redirect('/jobs')
}

exports.getMessages = async(req,res,next) => {
    const connections = await connection.find({ users: { $in: [req.user._id]}}).populate("users").exec()
    const connectionData = {
        students: [],
        alumni: []
    }
    connections.forEach(connection => {
        for(const user of connection.users) {
            if(user.role === "alumni" && !connectionData.alumni.includes(user._id)) {
                connectionData.alumni.push(user._id)
            }
            if(user.role === "student" && !connectionData.students.includes(user._id)) {
                connectionData.students.push(user._id)
            }
            if(user.role === "alumni" && !connectionData.alumni.includes(user._id)) {
                connectionData.alumni.push(user._id)
            }
            if(user.role === "student" && !connectionData.students.includes(user._id)) {
                connectionData.students.push(user._id)
            }
        }
    })
    const connectedUsers = []
    connectedUsers.push(...(await Student.find({ user: { $in: connectionData.students, $ne: req.user._id }})))
    connectedUsers.push(...(await Alumni.find({ user: { $in: connectionData.alumni, $ne: req.user._id }})))
    res.render('userApp/messages',{
        user: req.userType,
        connectedUsers
    })
}

