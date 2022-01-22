const sanitizeHtml = require('sanitize-html');
const dataMapper = require('../dataMapper');
const checkForDuplicates = require('../../utils/checkForDuplicates');


module.exports = authController = {
    getChips: (req, res) => {
        try {
            const userId = parseInt(req.params.userId);

            dataMapper.getUserById(userId, (error, result) => {
                if (!result) {
                    return res.status(401).json({ message: `L'utilisateur ${userId} n'a pas été trouvé !` });
                } else {
                    dataMapper.getChipsByUserId(userId, (error, result) => {
                        if (!result) {
                            return res.status(200).json({ message: `Pas de jetons.` });
                        } else {
                            return res.status(200).json({ chips: result.rows });
                        }
                    });
                }
            });
        } catch {
            res.status(500).json({ message: `Server error, please contact an administrator` });
        }
    },
    saveChips: (req, res) => {
        try {
            const userId = parseInt(req.params.userId);
            const chips = req.body.chips;

            const sanitizedChips = chips.map(chip => {
                for (element in chip) {
                    element = sanitizeHtml(element);
                }
                return chip;
            });

            let errorMessage = "";

            //Vérification des doublons
            if (checkForDuplicates(sanitizedChips, 'color')) {
                errorMessage = "Plusieurs jetons ont la même couleur. Vérifiez votre saisie.";
            }
            if (checkForDuplicates(sanitizedChips, 'value')) {
                errorMessage = "Plusieurs jetons ont la même valeur. Vérifiez votre saisie.";
            }

            dataMapper.removeChips(userId, (error, result) => {
                if (!result) {
                    console.log(error);
                    errorMessage = "Utilisateur inconnu. Contactez un administrateur.";
                } else {
                    console.log("jetons supprimés");
                    sanitizedChips.forEach(chip => {
                        if (!chip.value || !chip.quantity || !chip.color) {
                            console.log("La valeur et le nombre ne peuvent pas être à zéro. Vérifiez votre saisie.")
                            errorMessage = "La valeur et/ou le nombre ne peuvent pas être à zéro. Vérifiez votre saisie.";
                        } else {
                            dataMapper.saveChip(chip, userId, (error, result) => {
                                if (!result) {
                                    console.log(error);
                                    errorMessage = "Impossible d'accéder à la base de données. Veuillez contacter un administrateur."
                                }
                            });
                        }
                    });
                    if(!errorMessage){
                        return res.status(200).json({message: "Les jetons ont bien été enregistrés."});
                    } else {
                        return res.status(401).json({message: errorMessage});
                    }
                }
            })
        } catch {
            res.status(500).json({ test: `Server error, please contact an administrator` });
        }
    }
};