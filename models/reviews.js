const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewschema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    comments: String,
    created_at: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});
module.exports = mongoose.model("review", reviewschema);