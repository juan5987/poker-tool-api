const client = require('./database');

exports.postUser = (username, email, password, confirmationCode, callback) => {
    client.query(`INSERT INTO "user" ("username", "email", "password", "confirmationCode") VALUES
    ($1, $2, $3, $4)`, [username, email, password, confirmationCode], callback);
}

exports.getUserByName = (username, callback) => {
    client.query(`SELECT * FROM "user" WHERE "username"=$1`, [username], callback);
}

exports.getUserByMail = (email, callback) => {
    client.query(`SELECT * FROM "user" WHERE "email"=$1`, [email], callback);
}

exports.getUserByConfirmationCode = (confirmationCode, callback) => {
    client.query(`SELECT * FROM "user" WHERE "confirmationCode"=$1`, [confirmationCode], callback);
}

exports.activateAccount = (confirmationCode, callback) => {
    client.query(`UPDATE "user" SET "confirmationCode"='activated' WHERE "confirmationCode"=$1`,[confirmationCode], callback);
}

exports.updatePassword = (password, email, callback) => {
    client.query(`UPDATE "user" SET "password"=$1, "forgotPasswordCode"='changed'  WHERE "email"=$2`, [password, email], callback);
}

exports.insertForgotPasswordCode = (forgotPasswordCode, email, date, callback) => {
    client.query(`UPDATE "user" SET "forgotPasswordCode"=$1, "updated_at"=$3, "passwordCanBeModified"='true' WHERE "email"=$2`, [forgotPasswordCode, email, date], callback);
}

exports.getUserByForgotPasswordCode = (forgotPasswordCode, callback) => {
    client.query(`SELECT * FROM "user" WHERE "forgotPasswordCode"=$1`, [forgotPasswordCode], callback);
}