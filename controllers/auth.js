const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/user')
const Address = require('../models/address')
const Alumni = require('../models/alumni')
const Student = require('../models/student')
const Contact = require('../models/contact')
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }
  else{
    message = null;
  }
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    errorMessage: message,
  });
};
exports.getAdminLogin = (req,res,next)=>{
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }
  else{
    message = null;
  }
  console.log(req.session.isLoggedIn);
  res.render('auth/adminLogin', {
    errorMessage: message,
  });
}
exports.postAdminLogin = (req,res,next)=> {
  const email = req.body.email;
  const password = req.body.password;
  if(email === "admin@admin.com" && password === "admin"){
    req.session.isLoggedIn = true;
    req.session.save(err => {
      res.redirect('/admin');
      console.log(err);
    })
  }
  else{
    req.flash('error', 'Invalid Login Credentials');
    res.redirect('/admin-login');
  }
}
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
    .then(user => {
      if(!user){
        req.flash('error', 'Invalid Email Address')
        return res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if(!doMatch){
            req.flash('error', 'Invalid password')
            return res.redirect('/login');
          }
          req.session.isLoggedIn = true;
          req.session.user = user;
          console.log(req.session)
          req.session.save(err => {
            res.redirect('/home');
            console.log(err);
          })
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login')
        })
    })
    .catch(err => {
      console.log(err);
      res.redirect('/login')
    })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/')
  })
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }
  else{
    message = null;
  }
  res.render('auth/signup', {
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const defaultRole = "student"
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-mail already exists, please try another email')
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          email: email,
          password: hashedPassword,
          role: defaultRole,
        });
        console.log(email, password);
        return user.save();
      })
      .then(result => {
        User.findOne({email: email})
          .then(user => {
            const id = user._id;
            res.redirect(`/role/${id}`)
          })
          .catch(err => {
            console.log(err);
          })
      })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getRole = (req,res,next)=>{
  const userId = req.params.userId;
  res.render('auth/role',{
    userId: userId 
  })
}

exports.postRole = (req,res,next)=>{
  const role = req.body.role;
  const userId = req.body.userId;

  User.findById(userId)
    .then(user => {
      return user.addRole(role);
    })
    .then(result => {
      res.redirect(`/details/${userId}`);
    })
    .catch(err => {
      console.log(err);
    })

} 

exports.getDetails = (req,res,next)=>{
  const userId = req.params.userId;
  // console.log(userId);
  
  User.findById(userId)
    .then(user => {
      res.render('auth/details',{
        role: user.role,
        userId: userId 
      })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postDetails = (req,res,next) => {
  const userId = req.body.userId;
  const role = req.body.role;
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

  const contact = new Contact({
    phone: +phone,
    email: email,
    user: new ObjectId(userId)
  })
  const address_data = new Address({
    address: address,
    city: city,
    pincode: +pincode,
    state: state,
    country: country,
    user: new ObjectId(userId)
  })

    if(role === "alumni"){
      const workplace = req.body.workplace;
      const alumni = new Alumni({
        firstname: firstname,
        lastname: lastname,
        age: +age,
        dob: new Date(dob),
        institute: instituteName,
        joinYear: +joinYear,
        passYear: +passYear,
        bio: bio,
        workplace: workplace,
        imageUrl: profileImageUrl,
        user: new ObjectId(userId)
      })
      alumni.save()
        .then(result => {
          return contact.save()
        })
        .then(result2 => {
          return address_data.save()
        })
        .then(result3 => {
          console.log('Alumni details added successfully')
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
        })
    }
    else if(role === "student"){
      const student = new Student({
        firstname: firstname,
        lastname: lastname,
        age: +age,
        dob: new Date(dob),
        institute: instituteName,
        joinYear: +joinYear,
        passYear: +passYear,
        bio: bio,
        imageUrl: profileImageUrl,
        user: new ObjectId(userId)
      })
      student.save()
        .then(result => {
          return contact.save()
        })
        .then(result2 => {
          return address_data.save()
        })
        .then(result3 => {
          console.log('Student details added successfully')
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
        })
    }
}

exports.getAdmin = async(req,res,next) =>{
  try {
      res.render("userApp/admin");
  } catch (error) {
      console.log(error);
  }
}

exports.searchMail = async (req, res, next) => {
  const data = req.query.email
  if(!data.length) {
    return res.status(200).send([])
  }
  const emails = await User.find({ email: data }).select("email")
  console.log("emails", emails)
  if(!emails || !emails.length) {
    return res.status(400).send("Email doesn't exist")
  }
  res.status(200).send("Email exists. Try to login")
} 