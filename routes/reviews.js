const Express = require("express");
const router = Express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { isLoggedin } = require("../middleware.js");
const { validateReview, isReviewauthor } = require("../middleware.js");
const reviewcontroller = require("../controller/reviews.js")



//post review route
router.post("/", isLoggedin, validateReview, wrapAsync(reviewcontroller.reviewpostroute));

//delete review route
router.delete("/:reviewid", isLoggedin, isReviewauthor, wrapAsync(reviewcontroller.reviewdeleteroute));

module.exports = router;