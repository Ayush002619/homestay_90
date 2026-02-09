const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passwordlocalmongoose = require("passport-local-mongoose");

const userschema = new Schema({
    email: {
        type: String,
        require:true,
    },
});
userschema.plugin(passwordlocalmongoose.default);
module.exports = mongoose.model("User", userschema);