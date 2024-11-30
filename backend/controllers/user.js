const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")


module.exports.user = async(req,res)=>{
    const email = req.query.email;

    const data = await User.find({email:email});
    res.json(data)

};