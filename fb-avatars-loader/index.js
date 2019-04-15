const request = require('async-request');
const { Client } = require('pg');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const DB_PASSWORD = process.env.DB_PASSWORD;

function getDbConnection() {
    const conn = `postgres://postgres:${DB_PASSWORD}@aae8xl9u7zj36e.cfmvmprrntcm.eu-central-1.rds.amazonaws.com/postgres`;
    const client = new Client(conn);
    return client;
}

async function fetchPsids(dbClient) {
    var result = await dbClient.query("SELECT psid FROM public.users");
    return result.rows.map(r => r.psid);
}

async function fetchUserData (senderPsid) {
    const url = `https://graph.facebook.com/v2.6/${senderPsid}?access_token=${PAGE_ACCESS_TOKEN}&fields=profile_pic`;

    const response = await request(url);
    return JSON.parse(response.body);
}

async function updateAvatar(dbClient, id, avatar) {
    await dbClient.query(`UPDATE public.users SET avatar_url = '${avatar}' WHERE psid = '${id}';`);
}

exports.handler = async function(event, context) {
    const dbClient = getDbConnection();
    await dbClient.connect();
    
    const psids = await fetchPsids(dbClient);
    let updated = 0, failed = 0;
    
    for(const psid of psids) {
        try {
            var userData = await fetchUserData(psid);
            await updateAvatar(dbClient, userData.id, userData.profile_pic);
            updated++;
        }
        catch(error) {
            console.log(error);
            failed++;
        }
    }
    
    await dbClient.end();

    context.succeed(`Updated: ${updated}, failed: ${failed}`);
};
