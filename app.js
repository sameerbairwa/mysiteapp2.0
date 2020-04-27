var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyparser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

// bring all routes
var indexRouter = require("./routes/index");
const auth = require("./routes/api/auth");
// var usersRouter = require('./routes/users');

var app = express();

require("./config/passportStrategy");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

var sess = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //   maxAge: 1000 * 60 * 60,
  //   sameSite: true,
  //   secure: false
  // }
};

//Middlewares

app.use(logger("dev"));
app.use(express.json());
// parse application/json
app.use(bodyparser.json());
// Middleware for bodyparser
// parse application/x-www-form-urlencoded
app.use(
  bodyparser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
//session middleware
app.use(session(sess));
app.use(flash());
// Middleware for passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

//mongoDB configuration
const mongodbURL = require("./setup/myurl").mongoURL;

// Attempt to connect to database
mongoose
  .connect(mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb is connected");
  })
  .catch((err) => {
    console.log("mongodb not connected");
    console.log(err);
  });

app.use((req,res,next)=>{
  res.locals.login = req.isAuthenticated();
  next();
}) 
app.use("/", indexRouter);
// app.use('/', usersRouter);
app.use("/api/auth", auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;