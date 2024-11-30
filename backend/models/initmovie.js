const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
       Title: String,
       Poster:String,
       Year:String,
       Actors:String,
       Director:String,
       Plot:String,
       Language:String
})

const Movies = mongoose.model("Movies", movieSchema);
module.exports = Movies;