const sanitizeHtml = require('sanitize-html');
const dataMapper = require('../dataMapper');


module.exports = atournamentController = {
    getTournaments: (req, res) => {
        try {

            const userId = req.params.userId;

            dataMapper.getTournaments(userId, (error, result) => {
                if (!result) {
                    console.log(error);
                    res.status(500).json({ message: "La requête a échoué, contactez un administrateur." })
                } else {
                    res.status(200).json({ tournaments: result.rows });
                }
            });

        } catch (error) {
            console.log(error);
        }
    },
    createTournament: (req, res) => {
        try {
            const userId = req.params.userId;
            const tournament = req.body;

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

            //SI OK
            dataMapper.createTournament(tournament, userId, (error, result) => {
                if (!result) {
                    console.error(error);
                } else {
                    return res.status(200).end();
                }
            });
        } catch (error) {
            console.log(error);
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
        }
    },
    updateTournament: (req, res) => {
        try {
            const tournament = req.body.tournament
            dataMapper.updateTournament(tournament, (error, result) => {
                if(!result){
                    console.log(error);
                } else {
                    res.status(200).end();
                }
            });
        } catch (error) {
            console.error(error);
        }
    },
}