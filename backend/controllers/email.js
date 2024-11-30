require('dotenv').config();

const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const User = require("../models/user.js");
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASS = process.env.USER_EMAIL_PASS;

app.use(express.json());

const transport = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:`${USER_EMAIL}`,
        pass:`${USER_PASS}`,
    },
});


module.exports.email = async(req,res)=>{
    const { email, movie, date, time, theater, seats, seatPrice, totalFoodPrice } = req.body;
    const convenienceFee = 45; 
    const totalAmount = seatPrice + convenienceFee + totalFoodPrice;

    try{
        const existingBooking = await User.findOne({
                email,
                "movie.Title": movie.Title,
                "date.day": date.day,
                "date.month": date.month,
                "date.year": date.year,
                time,
                "theater.name": theater.name,
            });
        if(existingBooking){
            return res.status(200).json({message: "Booking already exists , email not sent again"});
        }
    
    const userData = {
        email:email,
        movie:movie,
        date:date,
        time: time,
        theater:theater,
        seats:seats,
        seatPrice:seatPrice,
        totalFoodPrice:totalFoodPrice,
        totalAmount:totalAmount,
    }
    try{
     await User.insertMany(userData);
    }catch(err){
        console.log("data not added to db", err);
    }

    const mailOption = {
        from:`${User}`,
        to:email,
        subject:"Booking Conformation - Movie Ticket",
        html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: black;">Booking Confirmation</h1>
      <p style="color: black;">Dear Customer,</p>
      <p style="color: black;">Your booking is confirmed. Here are the details:</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong style="color: black;">Movie Name:</strong> ${movie.Title}</li>
        <li><strong style="color: black;">Date:</strong> ${date.day}/${date.month}/${date.year}</li>
        <li><strong style="color: black;">Time:</strong> ${time}</li>
        <li><strong style="color: black;">Theater:</strong> ${theater.name}</li>
        <li><strong style="color: black;">Seats:</strong> ${seats.join(", ")}</li>
        <li><strong style="color: black;">Ticket Price:</strong> Rs.${seatPrice}</li>
        <li><strong style="color: black;">Convenience Fee:</strong> Rs.${convenienceFee}</li>
        <li><strong style="color: black;">Food & Beverages:</strong> Rs.${totalFoodPrice}</li>
        <li><strong style="color: black;">Total Amount:</strong> Rs.${totalAmount}</li>
      </ul>
      <p>Thank you for booking with us!</p>
       </div>
    `,
    };

    try{
        await transport.sendMail(mailOption);
        res.status(200).json({message: 'Booking email sent successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Failed to send booking email", err});
    }
}catch(err){
    console.log(err);

}

};