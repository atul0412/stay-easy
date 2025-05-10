const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");



// index route

module.exports.index = async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
      };


// new route
module.exports.renderNewForm = (req, res) => {
        res.render("listings/new.ejs");
      };


// show route

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id) .populate({path:"reviews",
  populate: { path: "author" } 
}) // Populate the author field in reviews
  .populate("owner"); // Populate the owner field with username
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  console.log(listing);


  res.render("listings/show.ejs",{listing });
};

// create route

module.exports.createListing = async(req, res, next) =>{
    let result = listingSchema.validate( req.body);
    console.log(result);
    if(result.error){
        throw new expressError(result.error, 400);
      }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the logged-in user
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};


// edit route
// render edit form

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  };


// update route
// update listing

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Successfully updated the listing!");
  res.redirect(`/`);
};

// delete route
// delete listing

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id, { ...req.body.listing });
  req.flash("success", "Successfully Delete the listing!");
  res.redirect('/');
};