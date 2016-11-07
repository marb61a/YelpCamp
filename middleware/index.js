var Comment = require("../models/comment"),
    Campground = require("../models/campground");
    
var middlewareObj = {};

// Checks ownership of comments
middlewareObj.checkCommentOwnership = function(req, res, next){
    // Check if user authenticated prior to comment ownership check
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");    
            } else if (foundComment.author.id.equals(req.user._id)){
                next();
            } else {
                res.redirect("back");
            }
        }); 
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkCampsiteOwnership = function(req, res, next){
    // Check if user authenticated prior to campsite ownership check
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCamp){
            if(err){
                res.redirect("back");    
            } else if (foundCamp.author.id.equals(req.user._id)){
                next();
            } else {
                res.redirect("back");
            }    
        }); 
    } else {
        req.flash("error", "Please log in");
        res.redirect("back");  
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in");
    res.redirect("/login");
};

module.exports = middlewareObj;