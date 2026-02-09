const User = require("../models/user");

module.exports.rendersignupform = (req, res) => {
    res.render("users/signup.ejs");
}
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username });
        let registereduser = await User.register(newuser, password);
        req.login(registereduser, (err) => {
            if (err) {
                return next(err)
            } else {
                req.flash("success", "Welcome to Wanderlust!")
                res.redirect("/listings");
            }
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderloginform = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to wanderlust!");
    let Redirecturl = res.locals.redirectUrl || "/listings";
    res.redirect(Redirecturl);
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
}