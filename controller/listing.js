const Listing = require("../models/listing");
const axios = require("axios");
require("dotenv").config();

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.newroute = async (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showroute = async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listings) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", { listings });
    }
};

module.exports.createroute = async (req, res, next) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;
        const newlisting = new Listing(req.body.listing);
        const locationText = req.body.listing.location;
        if (!locationText || locationText.trim() === "") {
            req.flash("error", "Location is required");
            return res.redirect("/listings/new");
        }
        console.log(locationText);

        const geoResponse = await axios.get(
            "https://api.geoapify.com/v1/geocode/search",
            {
                params: {
                    text: locationText,
                    limit: 1,
                    apiKey: process.env.MAP_TOKEN
                }
            }
        );

        const geoData = await geoResponse.data;
        console.log(geoData.features[0].properties);

        if (!geoData.features || geoData.features.length === 0) {
            req.flash("error", "Invalid location");
            return res.redirect("/listings/new");
        }


        const { lat, lon } = geoData.features[0].properties;

        //Save coordinates in GeoJSON format
        newlisting.geometry = {
            type: "Point",
            coordinates: [lon, lat] // [longitude, latitude]
        };

        newlisting.owner = req.user._id;
        newlisting.image = { url, filename }
        await newlisting.save();
        req.flash("success", "New listing created!")
        res.redirect("/listings");
    } catch (err) {
        console.log(err);
        next();
    }
};



module.exports.editroute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }
    let originalimageurl = listing.image.url;
    originalimageurl = originalimageurl.replace("/upload", "/upload/c_thumb,g_face,w_200");
    res.render("listings/edit.ejs", { listing, originalimageurl });
};

module.exports.updateroute = async (req, res) => {
    let { id } = req.params;
    // let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    const oldLocation = listing.location;
    const newLocation = req.body.listing.location;

    if (oldLocation !== newLocation) {
        try {
            const response = await axios.get(
                `https://api.geoapify.com/v1/geocode/search?text=${newLocation}&apiKey=${process.env.MAP_TOKEN}`
            );

            const coordinates =
                response.data.features[0].geometry.coordinates;

            listing.geometry = {
                type: "Point",
                coordinates: coordinates
            };

        } catch (err) {
            console.log("Geocoding error:", err);
            req.flash("error", "Invalid location");
            return res.redirect("back");
        }
    }

    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = newLocation;
    listing.country = req.body.listing.country;

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    };
    await listing.save();
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteroute = async (req, res) => {
    let { id } = req.params;
    let deletelisting = await Listing.findByIdAndDelete(id);
    console.log(deletelisting);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};