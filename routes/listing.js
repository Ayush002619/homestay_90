const Express = require("express");
const router = Express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedin, isowner, validateListing } = require("../middleware.js");
const listingcontroller = require("../controller/listing.js");
const multer = require('multer')
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });


router
    .route("/")
    //_____________INDEX ROUTE_____________
    .get(wrapAsync(listingcontroller.index))
    //_____________CREATE ROUTE_____________
    .post(isLoggedin, upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.createroute)
    );
// .post(upload.single("listing[image]"), (req, res) => {
//     res.send(req.file);
// });

//______________NEW ROUTE____________________
router.get("/new", isLoggedin, listingcontroller.newroute);
//______________SEARCH ROUTE_________________
router.get("/search", listingcontroller.searchroute);
router
    .route("/:id")
    //_____________SHOW ROUTE_______________
    .get(wrapAsync(listingcontroller.showroute))
    //_____________UPDATE ROUTE_____________
    .put(isLoggedin, isowner, upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.updateroute))
    //____________DELETE ROUTE______________
    .delete(isLoggedin, isowner, wrapAsync(listingcontroller.deleteroute));



//_______________________EDIT ROUTE______________________________
router.get("/:id/edit", isLoggedin, isowner, wrapAsync(listingcontroller.editroute));



module.exports = router;