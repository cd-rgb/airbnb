const { string } = require("joi");
const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Review=require("./review.js");
let { Schema } = mongoose;


let schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1532778039000-9c5c9d4130c5?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1532778039000-9c5c9d4130c5?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v

    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "review"
    }]
})
schema.post("findOneAndDelete", async (listing) => {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
})
const listing = mongoose.model("listing", schema);
module.exports = listing;