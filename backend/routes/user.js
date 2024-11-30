const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const userController = require("../controllers/user.js");

router.get("/", wrapAsync(userController.user));

module.exports = router;