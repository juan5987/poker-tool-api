const client = require('./database');

const dataMapper = {
    //USER
    postUser : (username, email, password, confirmationCode, callback) => {
        client.query(`INSERT INTO "user" ("username", "email", "password", "confirmationCode") VALUES
        ($1, $2, $3, $4)`, [username, email, password, confirmationCode], callback);
    },
    getUserById: (userId, callback) => {
        client.query(`SELECT * FROM "user" WHERE "id"= $1`, 
        [userId], callback);
    },

    getUserByName: (username, callback) => {
        client.query(`SELECT * FROM "user" WHERE "username"=$1`, 
        [username], callback);
    },
    
    getUserByMail: (email, callback) => {
        client.query(`SELECT * FROM "user" WHERE "email"=$1`, 
        [email], callback);
    },
    
    getUserByConfirmationCode: (confirmationCode, callback) => {
        client.query(`SELECT * FROM "user" WHERE "confirmationCode"=$1`, 
        [confirmationCode], callback);
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
        client.query(`SELECT * FROM "user" WHERE "forgotPasswordCode"=$1`, 
        [forgotPasswordCode], callback);
    },
    updateUserWithoutPassword: (username, email, userId, callback) => {
        client.query(`UPDATE "user" SET "username" = $1, "email" = $2 WHERE "id"= $3`, 
        [username, email, userId], callback);
    },
    updateUserWithPassword: (username, email, password, userId, callback) => {
        client.query(`UPDATE "user" SET "username" = $1, "email"=$2, "password"=$3 WHERE "id"= $4`, [username, email, password, userId], callback);
    },
    deleteUserAccount: (userId, callback) => {
        client.query(`DELETE FROM "user" WHERE "id" = $1`, 
        [userId], callback);
    },
    // CHIPS
    getChipsByUserId: (userId, callback) => {
        client.query(`SELECT * FROM "chip" WHERE "user_id" = $1 `, 
        [userId], callback);
    },

    saveChip: (chip, userId, callback) => {
        client.query(`INSERT INTO "chip" ("quantity", "color", "value", "user_id") VALUES ($1, $2, $3, $4)`, [chip.quantity, chip.color, chip.value, userId], callback);
    },
    removeChips: (userId, callback) => {
        client.query(`DELETE FROM "chip" WHERE "user_id"= $1`, 
        [userId], callback);
    },
    // TOURNAMENTS
    getTournaments: (userId, callback) => {
        client.query(`SELECT * FROM "tournament" WHERE "user_id" = $1`, 
        [userId], callback);
    },
    createTournament: (tournament, userId, callback) => {
        client.query(`INSERT INTO "tournament" ("name", "date", "location", "nb_players", "speed", "starting_stack", "buy_in", "status", "small_blind", "rebuy","chips_user", "comments", "user_id") 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING "id"`, 
        [tournament.name, tournament.date, tournament.location, tournament.nbPlayer, tournament.speed, tournament.startingStack, tournament.buyIn, tournament.status,tournament.small_blind, tournament.rebuy, tournament.chips_user, tournament.comment, userId], 
        callback);
    },
    deleteTournament: (tournamentId, callback) => {
        client.query(`DELETE FROM "tournament" WHERE "id" = $1`, 
        [tournamentId], callback);
    },
    updateTournament: (tournament, callback) => {
        client.query(`UPDATE "tournament" 
        SET "name" =$1, "date" =$2, "location" = $3, "nb_players"= $4, "speed" = $5, "starting_stack" = $6, "buy_in" = $7, "small_blind" = $8, "rebuy" = $9, "chips_user" = $10, "comments" = $11
        WHERE "id" = $12 RETURNING "id"`, [tournament.name, tournament.date, tournament.location, tournament.nbPlayer, tournament.speed, tournament.startingStack, tournament.buyIn, tournament.small_blind, tournament.rebuy, tournament.chips_user, tournament.comment, tournament.id], callback);
    },
    // PRIZEPOOL
    getPrizePool: (tournamentId, callback) => {
        client.query(`SELECT * FROM "cashprice" WHERE "tournament_id" = $1`, [tournamentId], callback);
    },
    postPrizePool: (prizePool, callback) => {
        client.query(`INSERT INTO "cashprice" ("position", "amount", "tournament_id") VALUES ($1, $2, $3) RETURNING "id", "position", "amount", "tournament_id"`, 
        [prizePool.position, prizePool.amount, prizePool.tournament_id], callback);
    },
    updatePrizePool: (prizePool, callback) => {
        client.query(`UPDATE "cashprice" 
        SET "position" = $1, "amount" = $2, "tournament_id" = $3 WHERE id= $4 RETURNING "position", "amount", "tournament_id"`, 
        [prizePool.position, prizePool.amount, prizePool.tournament_id, prizePool.id], callback);
    },
    deletePrizePool: (tournamentId, callback) => {
        client.query(`DELETE FROM "cashprice" WHERE "tournament_id" = $1`, [tournamentId], callback);
    }
}

module.exports = dataMapper;