const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema.js");
const {isloggedIn, isOwner, validateListing} = require("../middleware.js");

const  listingController = require("../controllers/listings.js");


router
.route("/")
.get( wrapAsync(listingController.index))
.post(isloggedIn,validateListing,wrapAsync(listingController.createListing)  );

//New Route
router.get("/new", isloggedIn , listingController.renderNewForm);

router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isloggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing))
.delete( isloggedIn, isOwner,  wrapAsync(listingController.deleteListing));




//Edit Route
router.get("/:id/edit", isloggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;