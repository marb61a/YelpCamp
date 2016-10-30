var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

// Show all campgrounds
router.get('/', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds : allCampgrounds,
                currentUser : req.user
            });
        }
    });
});

// Add a new campground to the DB
router.post('/', function(req, res){
    // Gets the form data
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name : name,
        image : image,
        description : desc,
        author: author
    };
    
    // Create a new campground and save it to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});