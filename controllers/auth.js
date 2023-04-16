const User = require('../models/user')
const bcrypt = require('bcryptjs')

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
          req.session.save(err => {
            console.log(err);
            res.redirect('/home');
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
  User.findById(userId)
    .then(user => {
      res.render('auth/details',{
        user: user 
      })
    })
    .catch(err => {
      console.log(err);
    })
  
}