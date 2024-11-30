const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const foodController = require("../controllers/food.js");


router.get("/all", wrapAsync(foodController.all));

router.get("/popcorn", wrapAsync(foodController.popcorn));

router.get("/snacks", wrapAsync(foodController.snacks));

router.get("/combos", wrapAsync(foodController.combos));

router.get("/beverages", wrapAsync(foodController.beverages));

module.exports = router;