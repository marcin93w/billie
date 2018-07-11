var request = require('request-promise');
var PAGE_ACCESS_TOKEN = process.argv[2]

function fetchUserData (senderPsid) {
    //console.log(senderPsid)
    return request({
            url: "https://graph.facebook.com/v2.6/" + senderPsid,
            qs: {
                access_token: PAGE_ACCESS_TOKEN,
                fields: "first_name,last_name,gender,profile_pic"
            },
            method: "GET"
        })
        .then(function(body) {
            const bodyObj = JSON.parse(body);
            console.log(`UPDATE public.users SET avatar_url = '${bodyObj.profile_pic}' WHERE psid = '${bodyObj.id }';`)
        })
        .catch(err => {});
}

let psids = process.argv[3].split(',')

psids.forEach(psid => {
    fetchUserData(psid)
});