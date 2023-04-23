const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const MONGODB_URI =
  "mongodb+srv://tusharph1:waBNaaagIH0u97aR@cluster0.x6qzg8m.mongodb.net/app?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const authRoutes = require("./routes/auth");
const userAppRoutes = require("./routes/userApp");

const User = require("./models/user");
const Student = require("./models/student");
const Alumni = require("./models/alumni");

const errorController = require("./controllers/error");

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      return next();
    })
    .catch(err => {
      console.log(err);
    })
});

app.use((req,res,next)=>{
  if (!req.session.user) {
    return next();
  }
  const role = req.user.role;
    if(role === "student"){
      Student.findOne({user:req.user})
        .then(student => {
          req.userType = student;
          return next();
        })
        .catch(err => {
          console.log(err);
        })
    }
    else if(role === "alumni"){
      Alumni.findOne({user:req.user})
        .then(alumni => {
          req.userType = alumni;
          return next();
        })
        .catch(err => {
          console.log(err);
        })
    }
    
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(authRoutes);
app.use(userAppRoutes);

app.use(errorController.get404);

mongoose
.connect(MONGODB_URI)
.then((result) => {
  console.log("Database connected");
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
})
.catch((err) => {
  console.log(err);
});
// waBNaaagIH0u97aR
