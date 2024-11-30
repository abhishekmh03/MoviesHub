const Movies = require("../models/initmovie.js");

module.exports.movieData = async(req,res)=>{
    const movieData = await Movies.find({});
    res.json(movieData);
};