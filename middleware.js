const Listing = require("./models/listing");
const expressError = require("./utils/expressError");
const { listingSchema, reviewSchema } = require("./schema.js");



module.exports.isloggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You must be signed in first!");
      return res.redirect("/login");
    }
    next();
  };
  
  module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session && req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  };
  
  module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log("owner", listing)
    if (!listing.owner || !listing.owner._id.equals(res.locals.currentUser._id)) {
      req.flash("error", "You are not a owner of the listing!");
      return;
    }
    next();
  };
    
  // listing validation

  module.exports. validateListing = (req, res, next) => { 
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new expressError(msg, 400);
    } else {
      next();
    }
  };

  // Review validation

  module.exports. validateReview = (req, res, next) => { 
    console.log(req.body);
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new expressError(msg, 400);
    } else {
      next();
    }
  };

  // Middleware to check if the user is the author of the review
  module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    const review = listing.reviews.find((review) => review._id.equals(reviewId));   
    if (!review.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that!");
      return res.redirect(`/listings/${id}`);
    }
    next();
  };