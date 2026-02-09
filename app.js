if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

// require('dotenv').config();
// console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ALTAS_URL;


const listingsrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const usersrouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");



async function main() {
    await mongoose.connect(dburl);
}

main().then((req, res) => {
    console.log("Connect to DB");
}).catch(err => {
    console.log(err);
});

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60,
});
const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(session(sessionoptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeuser = new User({
//         email: "ayush@gmaiol.com",
//         username: "delta-student",
//     });
//     let registereduser = await User.register(fakeuser, "helloworld");
//     res.send(registereduser);
// });

//______________________Signup and Login___________________
app.use("/", usersrouter);

//_______________________________________________________FOR LISTINGS________________________________________________________
app.use("/listings", listingsrouter);

//_______________________________________________________FOR REVIEW________________________________________________________
app.use("/listings/:id/reviews", reviewsrouter);

// app.get("/testListing", async (req, res) => {
//     let samplelistning = new Listing({
//         title: "My new villa's",
//         description: "By the beach",
//         price: 1200,
//         location: "Male,Maldives",
//         country: "India",
//     });
//     await samplelistning.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// });


// app.get("/listings/cheks/err", (req, res) => {
//     res.render("listings/error.ejs");
// });

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
    let { statuscode = 500, message = "something went wrong!" } = err;
    res.status(statuscode).render("listings/error.ejs", { err });
});
app.listen(8080, () => {
    console.log("Listening to the port 8080");
});