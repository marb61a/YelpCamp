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

// Show form to create Campground
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});


// Show more information about a campground
router.get("/:id", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit Campground
router.get('/:id/edit', checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// Update Campground
router.put('/:id', function(req, res){
    Campground.findByIdAndUpdate(req.params.id, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy Campground
router.delete('/:id', function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        // Does the user own that campground
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err){
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");    
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

module.exports = router;