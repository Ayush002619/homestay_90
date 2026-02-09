const Listing = require("./models/listing");
const review = require("./models/reviews");
const ExpressError = require("./utils/ExpressError.js");
const { listingschema, reviewschema } = require("./schema.js");

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};



module.exports.isowner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.curruser._id)) {
        req.flash("error", "you are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingschema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewauthor = async (req, res, next) => {
    let { id, reviewid } = req.params;
    console.log(id);
    console.log(reviewid);
    let curreview = await review.findById(reviewid)

    if (!curreview) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if (!curreview.author.equals(res.locals.curruser._id)) {
        req.flash("error", "you are not the owner of this review");
        return res.redirect(`/listings/${id}`)
    }
    next();
};