const express = require('express');
const router = express.Router( {mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { validateReview, isloggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//review route
//post route for review
router.post("/", isloggedIn,validateReview, wrapAsync(reviewController.createReview));

//delete route for review
router.delete("/:reviewId", 
  isloggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
); 

module.exports = router;