const nodemailer = require("nodemailer");
require('dotenv').config();

const sendEmailUpdatePassword = async (forgotPasswordCode, email) => {

    let transporter = nodemailer.createTransport({
        host: "pokertool.fr",
        port: 465,
        secure: true,
        auth: {
            user: process.env.NM_USER,
            pass: process.env.NM_PASS,
        },
    });

    let info = await transporter.sendMail({
        from: 'Poker Tool <no-reply@pokertool.fr>',
        to: `${email}`,
        subject: "Redéfinissez votre mot de passe",
        text: '',
        html: `
        <html lang="fr">

            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" rel="stylesheet">
                <title>Poker Tool</title>
            </head>

            <body style="font-family: poppins, sans-serif;">
                <div style="background-color: #000; color: white; width: 100%; font-size: 2rem;">
                    <img style="display: block; height: 80px; margin: 0 auto" src="http://dev.pokertool.fr/static/media/logo_mail.JPG" />
                </div>

                <h1 style="text-align: center;">Redéfinissez votre mot de passe</h1>
                <p style="text-align: center;">Vous avez oublié votre mot de passe ?</p>
                <p style="text-align: center;">Pas de problème, vous pourrez redéfinir votre mot de passe en cliquant sur le bouton ci-dessous:</p>
                <a style="background-color: #ee581e; text-decoration: none; color: white; font-size: 1.5rem; padding: 1rem; border-radius: 20px; display: block; width: min-content; white-space: nowrap; margin: 0 auto;" href="http://dev.pokertool.fr/forgot-password/${forgotPasswordCode}">Redéfinir mon mot de passe</a>
                <p style="text-align: center;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
                <br/>
                <p style="text-align: center;">A bientôt sur pokertool.fr !</p>
            </body>

            </html>`,
    });
}

module.exports = sendEmailUpdatePassword;