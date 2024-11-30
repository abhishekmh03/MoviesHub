const express = require("express");
const port = 8080;
const app = express();
const cors = require('cors');
const axios = require('axios');
app.use(cors({ origin: '*' }));
const DB_URL = process.env.MONGO_URL;
const mongoose = require("mongoose");
const Movies = require("../models/initmovie.js")


main().then(()=>console.log("Database is connected!"))
.catch((err)=>console.log(err));

async function main() {
   await mongoose.connect("mongodb://127.0.0.1:27017/movieshub")
}

const URL = "http://www.omdbapi.com/?apikey=1dcd8ae2&t=";

const movies = ["Leo", "Jawan", "rrr","animal","kantara","salaar","stree 2","devara","munjya","bhediya","fighter","master"];


const getMovieData = async()=>{
          const dataPromises = movies.map(async(name) =>{
            let response = await axios.get(`${URL}${name}`);
            const movie = response.data;
            return{
              Title:movie.Title,
              Poster:movie.Poster,
              Year:movie.Year,
              Actors:movie.Actors,
              Director:movie.Director,
              Plot:movie.Plot,
              Language:movie.Language
            }
          } );

          const fetchedMovies = await Promise.all(dataPromises);
         return fetchedMovies;
    
        };
      
      
        
app.get("/add" ,async(req,res)=>{
  try{
    const movieData = await getMovieData();
    res.json(movieData)
    Movies.insertMany(movieData);
    console.log("data is added")
  }catch(error){
    console.log("Error fetching movie data:", error);
    res.status(500).json({message:"An error occured while fetching data."})
  }
     
});



  app.listen(port,  ()=>{
    console.log("server is connected!")
  })