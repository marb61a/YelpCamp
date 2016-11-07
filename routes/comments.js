var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require("../middleware");

// New Comments
router.get('/new', isLoggedIn, function(req, res){
    // Find a campground by the ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

// Create Comments
router.post('/', isLoggedIn, function(req, res){
    // Lookup campgrounds using the ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // Add a usermane and an ID to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save the comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    res.redirect('/campgrounds/' + campground._id);
                } 
            });
        }    
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;