const express = require("express");
const router = express.Router();

//import controllers
const authController = require('./controllers/auth');;


//routes
router.post('/login', authController.login);

module.exports = router;