const express = require('express');
const router = express.Router();

//import controllers
const authController = require('./controllers/auth');
const chipController = require('./controllers/chips');
const tournamentController = require('./controllers/tournaments');

//routes
// User
router.get('/', (req, res) => res.status(200).send('API POKER TOOL V1.0'));
router.post('/api/login', authController.login);
router.post('/api/register', authController.register);
router.get('/api/confirmation/:confirmationCode', authController.confirmRegistration);
router.post('/api/forgot-password', authController.sendEmailToChangePassword);
router.patch('/api/forgot-password/:forgotPasswordCode', authController.updatePassword);
router.get('/api/profile/:userId', authController.getProfile);
router.patch('/api/profile/:userId',authController.updateProfile);
router.delete('/api/profile/:userId', authController.deleteUser);
// Chips
router.get('/api/chip/:userId', chipController.getChips);
router.post('/api/chip/:userId', chipController.saveChips);
// Tournaments
router.get('/api/tournaments/:userId', tournamentController.getTournaments);
router.post('/api/tournament/:userId', tournamentController.createTournament);
router.delete('/api/tournament/:userId', tournamentController.deleteTournament);
router.patch('/api/tournament/modify/:tournamentId', tournamentController.updateTournament);

module.exports = router;