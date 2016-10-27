var express = require("express"),
    app = express,
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require('method-override'),
    User = require("./models/user")

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.listen(process.env.PORT || 3000, function(){
   console.log("The YelpCamp Server Has Started!");
});