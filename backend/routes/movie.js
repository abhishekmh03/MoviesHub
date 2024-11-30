const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const movieController = require("../controllers/movie.js");

router.get("/", wrapAsync(movieController.movieData));

module.exports = router;