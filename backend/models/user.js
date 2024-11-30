const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    movie:Object,
    date:Object,
    time: String,
    theater:Object,
    seats:Array,
    seatPrice:String,
    totalFoodPrice:String,
    totalAmount:String,
})
const User = mongoose.model("User", userSchema);
module.exports = User;