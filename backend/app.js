require('dotenv').config();

const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const PORT = process.env.PORT || 8080;
const app = express();
const cors = require('cors');
const DB_URL = process.env.MONGO_URL;
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
const GoogleStrategy_callback_url = process.env.GOOGLESTRATEGY_CALLBACK_URL;

const movieRouter = require("./routes/movie.js");
const foodRouter = require("./routes/food.js");
const theaterRouter = require("./routes/theater.js");
const emailRouter = require("./routes/email.js");
const historyRouter = require("./routes/user.js");
const { isLoggedIn } = require('./middleware.js');
const { jwtMiddleware } = require("./middleware.js");

const cookieParser = require("cookie-parser");
app.use(cookieParser())
const JWT_SECRET =process.env.JWT_SECRET;


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
}
app.use(cors(corsOptions));




const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error", (err)=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        domain: ".onrender.com",
        expires:Date.now() + 7 * 24 * 60 *60 *1000,
        maxAge: 7 * 24 * 60 *60 *1000,
        httpOnly:true,   
        secure: true,
        sameSite:"none",
    },
};

app.use(session(sessionOption));

app.use(passport.initialize());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLESTRATEGY_CALLBACK_URL,
},(accessToken,refreshToken,profile,done) => {

    const user = {
        id: profile.id,
        email: profile.emails[0].value,
        profilePicture: profile.photos ? profile.photos[0].value : null, 
    };
    return done(null, user);
}));

passport.serializeUser((user,done)=> done(null,user));
passport.deserializeUser((user,done)=> done(null,user));

main().then(()=>console.log("Database is connected!"))
.catch((err)=>console.log(err));

async function main() {
   await mongoose.connect(DB_URL)
}


//Routes
app.get("/auth/google", passport.authenticate("google", {scope:["profile", "email"]}));

app.get("/auth/google/callback", passport.authenticate("google", {failureRedirect: "/"}), (req,res)=>{
    console.log("User logged in: ", req.user);
    const token = jwt.sign(
        { 
            id: req.user.id,
            email: req.user.email, 
            profilePicture: req.user.profilePicture
         },
        JWT_SECRET,
        {expiresIn: "7d"}
    );
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
    
    res.redirect(`${process.env.FRONTEND_URL}`);
});



app.get("/profile", jwtMiddleware, (req, res) => {
    res.json({
        user: req.user,
    });
});


app.get("/logout", (req,res)=>{
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.redirect(`${process.env.FRONTEND_URL}`);
})

app.get("/", (req,res)=>{
    res.send("Root Path");
})



app.use("/movies", movieRouter);
app.use("/food", foodRouter);
app.use("/theaters", theaterRouter);
app.use("/send-booking-email", emailRouter);
app.use("/user/history", historyRouter);

app.get("/proceed", (req,res)=>{
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Login To procced" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ message: "Action performed successfully!", user: decoded });
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }

});


app.use((req,res,next)=> {
    res.status(404).json({message:"This route you entered does not exist."})
})

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).json(message);
})

app.listen(PORT, ()=>{
    console.log("server is listining!")
})
