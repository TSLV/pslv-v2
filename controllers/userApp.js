const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require("../models/user");
const Address = require("../models/address");
const Alumni = require("../models/alumni");
const Student = require("../models/student");
const Post = require("../models/post");
const StudentPost = require("../models/studentpost");
const AlumniPost = require("../models/alumnipost");
const Contact = require("../models/contact");
const post = require("../models/post");

exports.getIndex = (req, res, next) => {
  res.render("userApp/index");
};

// exports.getDashboard = (req, res, next) => {
//   let userPosts = [];
//   const role = req.user.role;
//   if (role === "student") {
//     Student.findOne({ user: req.user })
//       .then((student) => {
//         Post.find()
//           .populate("user")
//           .then((data) => {
//             const userPost = [];
//             // const completeData = data.map(doc=>{
//             //     return Student.find({user:doc.user._id})
//             //         .then(st => {
//             //             return st;
//             //         })
//             // })
//             for(let i of data){
//                 Student.find({user: i.user._id})
//                     .then(st => {
//                         flag = true;
//                         userPost.push(st);
//                     })
//             }
//           });
//       })
//       //   .then((posts) => {
//       //     posts.populate("user").then((doc) => {
//       //       console.log(doc);
//       //     });
//       //     const newDataArray = posts.map(async (post) => {
//       //       const user = await post.populate("user");
//       //     //   console.log(user);
//       //       const role = user.user.role;
//       //       if (role === "student") {
//       //         const student = await Student.find({ user: user.user._id });
//       //         const newFormat = {
//       //           postDetails: await { ...post._doc },
//       //           userDetails: await { ...student[0]._doc },
//       //         };
//       //         return newFormat;
//       //       } else {
//       //         return (newFormat = {
//       //           postDetails: {},
//       //           userDetails: {},
//       //         });
//       //       }
//       //     });
//       //     // const newDataArray = posts.map((post) => {
//       //   await user = post.populate("user").then((user) => {
//       //     const role = user.user.role;
//       //     if (role === "student") {
//       //       Student.find({ user: user.user._id }).then((st) => {
//       //         const newFormat = {
//       //           postDetails: { ...post._doc },
//       //           userDetails: { ...st[0]._doc },
//       //         };
//       //         userPosts.push(newFormat);
//       //         return newFormat;
//       //       }).then(data=>{
//       //         return data;
//       //       })
//       //     }
//       //   });
//       // });
//       //   })
//       .catch((err) => {
//         console.log(err);
//       });
//   } else if (role === "alumni") {
//     Alumni.findOne({ user: req.user }).then((alumni) => {
//       res.render("userApp/home", {
//         user: alumni,
//         role: role,
//       });
//     });
//   }
// };
exports.getDashboard = (req,res,next)=>{
    const role = req.user.role;
    if(role === "student"){
        Student.findOne({user: req.user})
            .then(student => {
                StudentPost.find().populate('user')
                    .then(stposts=>{
                        AlumniPost.find().populate('user')
                            .then(alposts=>{
                                const posts = stposts.concat(alposts);
                                console.log(posts);
                                res.render('userApp/home', {
                                    user: student,
                                    role: role,
                                    posts: posts,
                                });
                            })
                    })

            })
            .catch(err=>{
                console.log(err);
            })
    }
    else if(role === "alumni"){
        Alumni.findOne({user: req.user})
            .then(alumni => {
                StudentPost.find().populate('user')
                    .then(stposts=>{
                        AlumniPost.find().populate('user')
                            .then(alposts=>{
                                const posts = stposts.concat(alposts);
                                posts.sort((a,b)=>{
                                    return new Date(b.timestamp) - new Date(a.timestamp);
                                })
                                console.log(posts);
                                res.render('userApp/home', {
                                    user: alumni,
                                    role: role,
                                    posts: posts,
                                });
                            })
                    })

            })
            .catch(err=>{
                console.log(err);
            })
    }
}
// exports.postPost = (req, res, next) => {
//   const caption = req.body.caption;
//   const imageUrl = req.body.imageUrl;

//   const post = new Post({
//     caption: caption,
//     imageUrl: imageUrl,
//     user: req.user,
//   });
//   post
//     .save()
//     .then((result) => {
//       console.log("posted successfully");
//       res.redirect("/home");
//     })
//     .catch((err) => console.log(err));
// };
exports.postPost = (req,res,next)=>{
    const caption = req.body.caption;
    const imageUrl = req.body.imageUrl;
    const role = req.user.role;
    if(role === 'student'){
        Student.find({user: req.user})
            .then(student => {
                console.log(student);
                const post = new StudentPost({
                    caption: caption,
                    imageUrl: imageUrl,
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

exports.getNetwork = (req, res, next) => {
  res.render("userApp/network", {
    user: req.user,
  });
};
