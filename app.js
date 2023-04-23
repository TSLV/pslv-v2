const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const { config } = require("dotenv")
const compression = require("compression");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userAppRoutes = require("./routes/userApp");
const User = require("./models/user");
const errorController = require("./controllers/error");
const Student = require("./models/student");
const Alumni = require("./models/alumni");
const connectionRoutes = require("./routes/connection")

config()

const DB_URL = process.env.DB_URL
const PORT = process.env.PORT || 6969

const app = express();
const store = new MongoDBStore({
  uri: DB_URL,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrf());
app.use(flash());
app.use(compression())
app.use(cors())

app.use((req, _, next) => {
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
  const role = req.user?.role;
  if(role === "student"){
    Student.findOne({ user:req.user })
    .then(student => {
      req.userType = student;
      return next();
    })
    .catch(console.log)
  }
  else if(role === "alumni"){
    Alumni.findOne({user:req.user})
    .then(alumni => {
      req.userType = alumni;
      return next();
    })
    .catch(console.log)
  }
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(authRoutes);
app.use(userAppRoutes);
app.use("/api/connection", connectionRoutes)
app.use(errorController.get404);

mongoose
.connect(DB_URL)
.then(() => {
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
  });
})
.catch(console.log);