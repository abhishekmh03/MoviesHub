const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodSchema = new Schema({
    name:String,
    info:String,
    image:String,
    price:Number,
    category:Array
})
const Foods = mongoose.model("Food", foodSchema);
module.exports = Foods;