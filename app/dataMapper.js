const client = require('./database');

exports.getUser = (email, password, callback) => {
    client.query(`SELECT * FROM "user" WHERE "email"=$1 AND "password"=$2`, [email, password], callback)
}

