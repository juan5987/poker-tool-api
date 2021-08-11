const dataMapper = require('../dataMapper');
const generateToken = require('../../utils/jwt');

module.exports = authController = {

    login: (req, res) => {

        const data = req.body;

        dataMapper.getUser(data.email, data.password, (error, result) => {

            if(result.rows[0]){

                const token = generateToken(result.rows[0].id);
            
                return res.status(200).json({
                    id: result.rows[0].id,
                    token: token,
                });
            } else {
                return res.status(401).json({
                    message: "Email ou mot de passe incorrect."
                    });
            }
        })
    }
}