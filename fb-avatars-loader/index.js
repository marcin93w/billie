const request = require('async-request');
const { Client } = require('pg')

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
const DB_PASSWORD = process.env.DB_PASSWORD

function getDbConnection() {
    const conn = `postgres://postgers:${DB_PASSWORD}@aa1798jl5zasldu.ckoqxmg442un.us-east-2.rds.amazonaws.com/postgres`;
    const client = new Client(conn);
    return client;
}

async function fetchPsids(dbClient) {
    var result = await dbClient.query("SELECT psid FROM public.users");
    return result.rows.map(r => r.psid)
}

async function fetchUserData (senderPsid) {
    const response = await request({
        url: "https://graph.facebook.com/v2.6/" + senderPsid,
        qs: {
            access_token: PAGE_ACCESS_TOKEN,
            fields: "profile_pic"
        },
        method: "GET"
    })
    
    const content = JSON.parse(response);
    console.log(`UPDATE public.users SET avatar_url = '${content.profile_pic}' WHERE psid = '${content.id }';`)

    return content
}

exports.handler = async function(event, context) {
    const dbClient = getDbConnection()
    await dbClient.connect()
    const psids = await fetchPsids(dbClient)
    console.log(JSON.stringify(psids))
    await dbClient.end()

    context.succeed(psids)
}


// let psids = process.argv[3].split(',')

// psids.forEach(psid => {
//     fetchUserData(psid)
// });

