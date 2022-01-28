var validator = require("email-validator");
const sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcrypt');
const saltRounds = 12;

const dataMapper = require('../dataMapper');
const generateToken = require('../../utils/jwt');
const verifPassword = require('../../utils/verifPassword');
const sendEmailConfirmation = require('../../utils/sendEmailConfirmation');
const sendEmailUpdatePassword = require('../../utils/sendEmailUpdatePassword');
const client = require("../database");

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
                                if (result.rows[0].confirmationCode === "activated") {
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
                                    confirmationCode += username;
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

            if (error) {
                console.log(error)
            } else {

                if (result.rows[0]) {
                    dataMapper.activateAccount(confirmationCode, (error, result) => {
                        res.status(200).end();
                    })
                } else {
                    res.status(401).end();
                }

            }

        })
    },
    sendEmailToChangePassword: (req, res) => {
        const email = req.body.email;

        dataMapper.getUserByMail(email, (error, result) => {
            if (error) {
                console.log(error);
            } else {
                if (result.rows[0]) {
                    const date = Date.now();
                    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    let forgotPasswordCode = '';
                    forgotPasswordCode += result.rows[0].username;
                    for (let i = 0; i < 25; i++) {
                        forgotPasswordCode += characters[Math.floor(Math.random() * characters.length)];
                    }
                    //Si le champ a été MAJ il y a plus de 5 minutes
                    if (Date.now() - result.rows[0].updated_at > (1000 * 60 * 5)) {
                        dataMapper.insertForgotPasswordCode(forgotPasswordCode, email, date, (error, result) => {
                            if (error) {
                                console.log(error);
                            } else {
                                sendEmailUpdatePassword(forgotPasswordCode, email);
                                res.status(200).end();
                            }
                        });
                    } else {
                        res.status(401).json({ message: "Un email a déjà été envoyé récemment, rééssayez dans quelques minutes." })
                    }

                } else {
                    res.status(401).json({ message: "Aucun compte associé à cette adresse email." })
                }
            }
        });

    },
    updatePassword: (req, res) => {

        if (!req.body.password || !req.body.passwordConfirm) {
            res.status(400).json({ message: "Un champ n'est pas renseigné." });
        } else {
            const forgotPasswordCode = req.params.forgotPasswordCode;
            let password = req.body.password;
            password = sanitizeHtml(password);

            const passwordConfirm = sanitizeHtml(req.body.passwordConfirm);

            if (password !== passwordConfirm) {
                res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
            } else {

                if (!verifPassword(password)) {
                    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères dont une lettre minuscule, une lettre majuscule et un chiffre." });
                } else {
                    dataMapper.getUserByForgotPasswordCode(forgotPasswordCode, (error, result) => {
                        if (error) {
                            console.log(error);
                        } else {
                            if (result.rows[0]) {
                                bcrypt.hash(password, saltRounds, function (err, hash) {
                                    const email = result.rows[0].email;
                                    dataMapper.updatePassword(hash, email, (error, result => {
                                        res.status(200).end();
                                    }))
                                });
                            } else {
                                res.status(401).json({ message: "Impossible de trouver le profil associé à cette url. Le lien a peut-être expiré ou le mot de passe a déjà été changé. Cliquez sur le bouton connexion puis mot de passe oublié pour recevoir un nouveau mail de redéfinition du mot de passe." })
                            }
                        }
                    })
                }
            }
        }
    },
    getProfile: (req, res) => {
        try {
            dataMapper.getUserById(req.params.userId, (error, result) => {
                if (!result) {
                    console.log(error);
                    res.status(500).json({ message: "Impossible de récupérer le profil." })
                } else {
                    res.status(200).json({ username: result.rows[0].username, email: result.rows[0].email });
                }
            })
        } catch(error) {
            console.error(error);
        }
    },
    updateProfile: (req, res) => {
        try {
            const userId = parseInt(req.params.userId);
            const username = sanitizeHtml(req.body.username);
            const email = sanitizeHtml(req.body.email);
            const emailConfirm = sanitizeHtml(req.body.emailConfirm);
            const password = sanitizeHtml(req.body.password);
            const passwordConfirm = sanitizeHtml(req.body.passwordConfirm);

            if (!username || !email || !emailConfirm) {
                return res.status(401).json({ message: "Le pseudo et l'email doivent être renseigné." });
            }

            if (email === emailConfirm) {
                const isEmailClean = validator.validate(req.body.email);
                if (!isEmailClean) return res.status(401).json({ message: "Format de l'email incorrect." })
            } else {
                return res.status(401).json({ message: "Les deux adresses emails ne correspondent pas." })
            }

            if (password !== passwordConfirm) return res.status(401).json({ message: "Les deux mots de passe ne correspondent pas." });

            if (!password && !passwordConfirm) {
                //UPDATE SANS MOT DE PASSE
                dataMapper.updateUserWithoutPassword(username, email, userId, (error, result) => {
                    if (!result) {
                        console.log(error);
                        return res.status(500).json({ message: "Problème lors de la requête. Contactez un administrateur." })
                    } else {
                        console.log("Le profil a bien été mis à jour.");
                        return res.status(200).json({ message: "Le profil a bien été mis à jour." })
                    }
                });
            } else {
                //UPDATE AVEC MOT DE PASSE
                if (!verifPassword(password)) {
                    return res.status(401).json({ message: "Le mot de passe doit contenir au moins 8 caractères dont une lettre minuscule, une lettre majuscule et un chiffre." });
                }

                bcrypt.hash(password, saltRounds, function (err, hash) {
                    dataMapper.updateUserWithPassword(username, email, hash, userId, (error, result) => {
                        if (!result) {
                            console.log(error);
                            return res.status(500).json({ message: "Problème lors de la requête. Contactez un administrateur." });
                        } else {
                            console.log("Le profil a bien été mis à jour.");
                            return res.status(200).json({ message: "Le profil a bien été mis à jour." });
                        }
                    });
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Problème lors de la requête. Contactez un administrateur." });
        }
    },
    deleteUser: (req, res) => {
        const userId = parseInt(req.params.userId);
        dataMapper.deleteUserAccount(userId, (error, result) => {
            if (!result) {
                console.log(error);
                res.status(500).json({ message: "Problème lors de la requête. Contactez un administrateur." });
            } else {
                res.status(200).json({ message: "Compte supprimé" });
            }
        });
    }
}