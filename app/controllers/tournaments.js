const { response } = require('express');
const sanitizeHtml = require('sanitize-html');
const dataMapper = require('../dataMapper');


module.exports = atournamentController = {
    getTournaments: (req, res) => {
        try {

            const userId = req.params.userId;

            dataMapper.getTournaments(userId, (error, result) => {
                if (!result) {
                    console.log(error);
                    res.status(500).json({ message: "La requête a échoué, contactez un administrateur." });
                } else {
                    res.status(200).json({ tournaments: result.rows });
                }
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "La requête a échoué, contactez un administrateur." });
        }
    },
    createTournament: (req, res) => {
        try {
            const userId = req.params.userId;
            const tournament = req.body.tournament;

            if (!tournament.name ||
                !tournament.date ||
                !tournament.location ||
                !tournament.nbPlayer ||
                !tournament.speed ||
                !tournament.startingStack ||
                !tournament.buyIn ||
                !tournament.small_blind)
                return res.status(401).json({ message: "Tous les champs obligatoires doivent être complétés." });

            if (tournament.startingStack <= tournament.small_blind) return res.status(401).json({ message: "La petite blind ne peut pas être supérieure ou égale au tapis de départ" });
            if (!tournament.comment) tournament.comment = "";
            tournament.status = "prévu";
            tournament.prizePool = [];

            dataMapper.createTournament(tournament, userId, async (error, result) => {
                if (!result) {
                    console.error(error);
                    return res.status(500).json({ message: "Impossible de créer le tournoi, veuillez contacter un administrateur." });
                } else {
                    return res.status(200).json({ tournament: result.rows[0] });
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Un problème est survenu, veuillez contacter un administrateur." });
        }
    },
    deleteTournament: (req, res) => {
        try {
            const tournamentId = req.body.tournamentId;

            if (!tournamentId) {
                console.log("ID du tournoi invalide");
                res.status(500).end();
            } else {
                dataMapper.deleteTournament(tournamentId, (error, result) => {
                    if (!result) {
                        console.log(error);
                    } else {
                        res.status(200).end();
                    }
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Un problème est survenu, veuillez contacter un administrateur." });
        }
    },
    updateTournament: (req, res) => {
        try {
            const tournament = req.body.tournament
            dataMapper.updateTournament(tournament, (error, result) => {
                if (!result) {
                    console.log(error);
                    return res.status(500).json({ message: "Problème lors de la modification du tournoi, veuillez contacter un administrateur." });
                } else {
                    return res.status(200).json({ id: result.rows[0].id });
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Un problème est survenu, veuillez contacter un administrateur." });
        }
    },
    getCashPrice: (req, res) => {

        const tournamentId = req.params.tournamentId;

        try {
            dataMapper.getPrizePool(tournamentId, (error, result) => {
                if (!result) {
                    console.log(error);
                    return res.status(500).json({ message: "Problème lors de la récupération du prizepool, veuillez contacter un administrateur." });
                } else {
                    return res.status(200).json({ prizePool: result.rows });
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Un problème est survenu, veuillez contacter un administrateur." });
        }
    },
    postCashPrice: (req, res) => {
        try {
            const prizePool = req.body.prizePool;

            dataMapper.postPrizePool(prizePool, (error, result) => {
                if (!result) {
                    console.error(error);
                    return res.status(500).json({ message: "Problème lors de la création du prizepool, veuillez contacter un administrateur." });
                } else {
                    console.log("prize pool ajouté avec succès.")
                    return res.status(200).json({ prizePool: result.rows[0] })
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Un problème est survenu, veuillez contacter un administrateur." });
        }
    },
    deletePrizePool: (req, res) => {
        try {
            const tournamentId = req.params.tournamentId;
            dataMapper.deletePrizePool(tournamentId, (error, result) => {
                if (!result) {
                    console.log(error);
                    return res.status(500).json({ message: "Prize pool supprimé(s) avec succès." })
                } else {
                    return res.status(200).end();
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Un problème est survenu, veuillez contacter un administrateur." });
        }

    },
}