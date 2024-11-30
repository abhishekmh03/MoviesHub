require('dotenv').config();

const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email.js");
const wrapAsync = require("../utils/wrapAsync.js");


router.post("/", wrapAsync(emailController.email));


module.exports = router;
