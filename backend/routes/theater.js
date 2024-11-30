require('dotenv').config();

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const theaterController = require("../controllers/theater.js");


router.get("/", wrapAsync(theaterController.getTheaters));

router.get("/default", wrapAsync(theaterController.default));

module.exports = router;