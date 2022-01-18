const express = require('express');
const router = express.Router();

//import controllers
const authController = require('./controllers/auth');
const chipController = require('./controllers/chips');

//routes
// User
router.get('/', (req, res) => res.status(200).send('API POKER TOOL V1.0'));
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/confirmation/:confirmationCode', authController.confirmRegistration);
router.post('/forgot-password', authController.sendEmailToChangePassword);
router.patch('/forgot-password/:forgotPasswordCode', authController.updatePassword);
router.get('/profile/:userId', authController.getProfile);
router.patch('/profile/:userId',authController.updateProfile);
// Chips
router.get('/chip/:userId', chipController.getChips);
router.post('/chip/:userId', chipController.saveChips);

module.exports = router;