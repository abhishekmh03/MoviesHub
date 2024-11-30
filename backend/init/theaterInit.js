const Theater = require("../models/theater.js")
const express = require("express");
const mongoose = require("mongoose");
const port = 8080;
const app = express();
const data = require("./theaterData.js");

main().then(()=>console.log("Database is connected!"))
.catch((err)=>console.log(err));

async function main() {
   await mongoose.connect("mongodb://127.0.0.1:27017/movieshub")
}


app.get("/add", async(req,res)=>{
    Theater.insertMany(data);
    res.json(data);
    console.log("data added");
 });
 
 app.listen(port, ()=>{
     console.log("Server is listining")
 })