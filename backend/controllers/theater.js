require('dotenv').config();

const Theater = require("../models/theater.js")

const apiKey = process.env.FOURSQUARE_API_KEY
const openCageAPIKey = process.env.GEOCODING_API_KEY

const url = "https://api.foursquare.com/v3/places/search";


const getCityCoordinates = async(city) =>{
    const url =`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${openCageAPIKey}&language=en`;
    try{
        const response = await fetch(url);
        const data = await response.json();
        
        if(data.results.length > 0){
            const location = data.results[0].geometry;
            return { lat: location.lat, lng: location.lng };
        }else{
            console.log("No results found for the city.");
            return null;
        }
    } catch (error) {
      console.error('Error fetching city coordinates:', error.message);
      return null;
    }
  };



const getTheaters = async(lat, lng)=>{
    const params = new URLSearchParams({
        ll: `${lat},${lng}`,
        radius: "10000",
        query: "theater",
        limit: "5" 
    })
   try{
    const response = await fetch(`${url}?${params.toString()}`, {
    headers:{
        'Authorization': apiKey
    }
    });
      if(!response.ok){
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
     }
     const data = await response.json();
     return data;
     }catch(error){
      console.error('Error fetching theaters:', error.message);
       return null;
   }
};




module.exports.getTheaters = async(req,res)=>{
    const city = req.query.city;
   const coordinates = await getCityCoordinates(city);

   if(coordinates){
    const {lat, lng} =coordinates;
    const theaters = await getTheaters(lat, lng);

     if (theaters) {
        res.json({
            success: true,
            city,
            theaters
        });

     }else {
      res.status(500).json({
      success: false,
      message: "Failed to fetch theater data."
     });
     }
     
  } else {
  res.status(500).json({
    success: false,
    message: "Failed to fetch city coordinates."
  });
}};


module.exports.default = async (req,res) => {
    const data = await Theater.find({});
    res.json(data);
};