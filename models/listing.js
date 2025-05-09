const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for a listing
const listingSchema = new Schema({
  title: {
    type: String,
    required: true, // Title is mandatory
  },
  description: {
    type: String, // Optional description
  },
  image: {
    type: String
  },
  price: {
    type: Number, // Optional price
  },
  location: {
    type: String, // Optional location
  },
  country: {
    type: String, // Optional country
  },
  reviews:[
    {
    type: Schema.Types.ObjectId,
    ref: "Review", // Reference to the Review model
  },
],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
});

listingSchema.post("findOneandDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({_id  :{ $in: listing.reviews}});
  }
});

// Create the model for the schema
const Listing = mongoose.model("Listing", listingSchema);

// Export the model for use in other parts of the application
module.exports = Listing;