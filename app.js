var express = require("express"),
    app = express,
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require('method-override'),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");
    
// Routes required
var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

// Passport Configuration
app.use(require("express-session")({
    secret: "abcd1234",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(process.env.PORT || 3000, function(){
   console.log("The YelpCamp Server Has Started!");
});