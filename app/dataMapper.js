const client = require('./database');



const dataMapper = {
    //USER
    postUser : (username, email, password, confirmationCode, callback) => {
        client.query(`INSERT INTO "user" ("username", "email", "password", "confirmationCode") VALUES
        ($1, $2, $3, $4)`, [username, email, password, confirmationCode], callback);
    },
    getUserById: (userId, callback) => {
        client.query(`SELECT * FROM "user" WHERE "id"= $1`, [userId], callback);
    },

    getUserByName: (username, callback) => {
        client.query(`SELECT * FROM "user" WHERE "username"=$1`, [username], callback);
    },
    
    getUserByMail: (email, callback) => {
        client.query(`SELECT * FROM "user" WHERE "email"=$1`, [email], callback);
    },
    
    getUserByConfirmationCode: (confirmationCode, callback) => {
        client.query(`SELECT * FROM "user" WHERE "confirmationCode"=$1`, [confirmationCode], callback);
    },
    
    activateAccount: (confirmationCode, callback) => {
        client.query(`UPDATE "user" SET "confirmationCode"='activated' WHERE "confirmationCode"=$1`,[confirmationCode], callback);
    },
    
    updatePassword: (password, email, callback) => {
        client.query(`UPDATE "user" SET "password"=$1, "forgotPasswordCode"='changed'  WHERE "email"=$2`, [password, email], callback);
    },
    
    insertForgotPasswordCode: (forgotPasswordCode, email, date, callback) => {
        client.query(`UPDATE "user" SET "forgotPasswordCode"=$1, "updated_at"=$3, "passwordCanBeModified"='true' WHERE "email"=$2`, [forgotPasswordCode, email, date], callback);
    },
    
    getUserByForgotPasswordCode: (forgotPasswordCode, callback) => {
        client.query(`SELECT * FROM "user" WHERE "forgotPasswordCode"=$1`, [forgotPasswordCode], callback);
    },
    updateUser: (username, email, password, userId, callback) => {
        client.query(`UPDATE "user" SET "username" = $1, "email"=$2, "password"=$3 WHERE "id"= $4`, [username, email, password, userId], callback);
    },
    // CHIPS
    getChipsByUserId: (userId, callback) => {
        client.query(`SELECT * FROM "chip" WHERE "user_id" = $1`, [userId], callback);
    },

    saveChip: (chip, userId, callback) => {
        client.query(`INSERT INTO "chip" ("quantity", "color", "value", "user_id") VALUES ($1, $2, $3, $4)`, [chip.quantity, chip.color, chip.value, userId], callback);
    },
    removeChips: (userId, callback) => {
        client.query(`DELETE FROM "chip" WHERE "user_id"= $1`, [userId], callback);
    }
}

module.exports = dataMapper;