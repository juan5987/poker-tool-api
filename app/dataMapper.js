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