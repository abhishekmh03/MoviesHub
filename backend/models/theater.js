const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const theaterSchema = new Schema({
    name:String,
    location:{
        address:String,
        locality:String,
        region:String, 
        cross_street: String,     
        formatted_address:String,
    }
})

const Theater = mongoose.model("Theater", theaterSchema);
module.exports = Theater;