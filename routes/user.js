const Express = require("express");
const router = Express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controller/user.js")

router.route("/signup")
    .get(usercontroller.rendersignupform)
    .post(wrapAsync(usercontroller.signup));

router.route("/login")
    .get(usercontroller.renderloginform)
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), usercontroller.login);

router.get("/logout", usercontroller.logout);

module.exports = router;