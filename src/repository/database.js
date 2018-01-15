const initOptions = {
    error: console.error
}

const pgp = require('pg-promise')(initOptions);

const cn = 'postgres://postgres:dupa.8@localhost:5432/postgres';
const db = pgp(cn);

module.exports = db;