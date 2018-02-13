import {IMain, IDatabase} from 'pg-promise';
import * as pgPromise from 'pg-promise';
import * as logger from '../utils/logger';

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

const pgp:IMain = pgPromise({
    error: logger.error,
    receive(data, result, e) {
        camelizeColumns(data);
    }
});

let cn:string = 'postgres://postgres:dupa.8@localhost:5432/postgres';
if (process.env.DATABASE_URL) {
    cn = process.env.DATABASE_URL + '?ssl=true';
} else if (process.env.RDS_HOSTNAME) {
    cn = `postgres://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/postgres?ssl=true`;
}

const db:IDatabase<any> = pgp(cn);

export = db;