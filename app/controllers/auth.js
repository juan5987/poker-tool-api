var validator = require("email-validator");
const sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcrypt');
const saltRounds = 12;

const dataMapper = require('../dataMapper');
const generateToken = require('../../utils/jwt');
const verifPassword = require('../../utils/verifPassword');
const sendEmailConfirmation = require('../../utils/sendEmailConfirmation');

module.exports = authController = {

    login: (req, res) => {

        const data = req.body;

        const password = sanitizeHtml(data.password, {
            allowedTags: [],
            allowedAttributes: {}
        })
        const isEmailClean = validator.validate(data.email);

        if (data.email && !isEmailClean) {
            return res.status(401).json({
                message: "Le format de l'email est incorrect."
            });
        }

        dataMapper.getUserByMail(data.email, (error, result) => {

            if (error) {
                console.log(error)
                return res.status(500).json({ message: "Un problème est survenu, veuillez contacter un administrateur." });
            } else {

                if (!data.email || !data.password) {
                    return res.status(401).json({
                        message: "email ou mot de passe non renseigné."
                    });
                } else {
                    if (result.rows[0]) {
                        bcrypt.compare(password, result.rows[0].password, function (err, result2) {
                            if (result2) {
                                if(result.rows[0].confirmationCode === "activated"){
                                    const token = generateToken(result.rows[0].id);
                                    return res.status(200).json({
                                        id: result.rows[0].id,
                                        token: token,
                                });
                                } else {
                                    return res.status(401).json({
                                        message: "Compte inactif. Un email contenant un lien d'activation vous a été envoyé. Vérifiez vos emails."
                                    });
                                }
                            } else {
                                return res.status(401).json({
                                    message: "Email ou mot de passe incorrect."
                                });

                            }
                        });
                    } else {
                        return res.status(401).json({
                            message: "Email ou mot de passe incorrect."
                        });
                    }
                }
            }
        })

    },
    register: (req, res) => {

        const data = req.body;

        //Je vérifie si tous les champs sont remplis
        if (data.email && data.emailConfirm && data.password && data.passwordConfirm && data.username) {

            const email = sanitizeHtml(data.email);
            const emailConfirm = sanitizeHtml(data.emailConfirm);
            const password = sanitizeHtml(data.password);
            const passwordConfirm = sanitizeHtml(data.passwordConfirm);
            const username = sanitizeHtml(data.username);

            if (email !== emailConfirm) {
                return res.status(400).json({ message: "Les emails ne correspondent pas." });
            }

            if (password !== passwordConfirm) {
                return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
            }

            if (!verifPassword(password)) {
                return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères dont une lettre minuscule, une lettre majuscule et un chiffre." });
            }

            //Je vérifie si le pseudo existe en BDD
            dataMapper.getUserByName(username, (error, result) => {
                if (error) {
                    console.log("Problème lors de la requête getUserByname");
                    return res.status(500).json({ message: "Un problème est survenu, veuillez contacter un administrateur." });
                } else {
                    if (result.rows[0]) {
                        return res.status(400).json({ message: "Ce pseudo est déjà utilisé." });
                    } else {
                        dataMapper.getUserByMail(email, (error, result) => {
                            if (error) {
                                console.log("Problème lors de la requête getuserByMail");
                                return res.status(500).json({ message: "Un problème est survenu, veuillez contacter un administrateur." });
                            } else {
                                if (result.rows[0]) {
                                    return res.status(400).json({ message: "Cette adresse email est déjà utilisée." })
                                } else {
                                    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                                    let confirmationCode = '';
                                    confirmationCode+=username;
                                    for (let i = 0; i < 25; i++) {
                                        confirmationCode += characters[Math.floor(Math.random() * characters.length)];
                                    }
                                    sendEmailConfirmation(confirmationCode, email);

                                    bcrypt.hash(password, saltRounds, function (err, hash) {
                                        dataMapper.postUser(username, email, hash, confirmationCode, (error, result) => {
                                            if (error) {
                                                console.log("Problème lors de la requête postUser");
                                                return res.status(500).json({ message: "Un problème est survenu, veuillez contacter un administrateur." });
                                            } else {
                                                return res.status(200).json({ message: "Votre compte a bien été créé." });
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(403).json({ message: "Tous les champs doivent être renseignés." });
        }
    },
    confirmRegistration: (req, res) => {
        const confirmationCode = req.params.confirmationCode;

        dataMapper.getUserByConfirmationCode(confirmationCode, (error, result) => {

            if(error){
                console.log(error)
            } else {

                if(result.rows[0]){
                    dataMapper.activateAccount(confirmationCode, (error, result) => {
                        res.status(200).end();
                    })
                } else {
                    res.status(401).end();
                }
                
            }

        })
    },
}