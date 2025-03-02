const express = require("express");
const app = express();
let listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const review = require("../models/review.js");
const router = express.Router({ mergeParams: true });
const validatereview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errmsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errmsg);
    }
    else {
        next();
    }
}

router.post("/", validatereview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    let res1 = await listing.findById(id);
    let rev = new review(req.body.review);
    res1.reviews.push(rev);
    await rev.save();
    await res1.save();
    res.redirect(`/listings/${id}`);

}));
router.delete("/:reviewid", wrapAsync(async (req, res) => {
    const { id, reviewid } = req.params;
    await review.findByIdAndDelete(reviewid);
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    res.redirect(`/listings/${id}`);
}))
module.exports = router;