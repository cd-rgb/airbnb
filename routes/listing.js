const express=require("express");
const app=express();
let listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const validateListing = function (req, res, next) {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errDetails = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errDetails);
    }
    else {
        next();
    }
}

const router=express.Router();
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await listing.find({});
    res.render("listing/index.ejs", { allListings });
}))
router.get("/new", (req, res) => {
    res.render("listing/new.ejs");
})
router.post("/", validateListing, wrapAsync(async (req, res) => {
    let list = new listing(req.body.listing);
    await list.save();
    res.redirect("/listings");


}))

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const list = await listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { list });
}))
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let allList = await listing.findById(id);
    console.log(allList);
    res.render("listing/edit.ejs", { allList });
}))
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings")
}))
router.delete("/:id/delete", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedList = await listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
}))




module.exports=router;