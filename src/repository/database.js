const initOptions = {
    error: console.error,
    receive(data, result, e) {
        camelizeColumns(data);
    }
}

function camelizeColumns(data) {
    const tmp = data[0];
    for (let prop in tmp) {
        const camel = pgp.utils.camelize(prop);
        if (!(camel in tmp)) {
            for (let i = 0; i < data.length; i++) {
                const d = data[i];
                d[camel] = d[prop];
                delete d[prop];
            }
        }
    }
}

const pgp = require('pg-promise')(initOptions);

const cn =  process.env.DATABASE_URL ? 
    process.env.DATABASE_URL + '?ssl=true' : 
    'postgres://postgres:dupa.8@localhost:5432/postgres';
const db = pgp(cn);

module.exports = db;