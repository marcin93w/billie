const request = require('request');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = {
    fetchName: (senderPsid, callback) => {
        request({
            url: "https://graph.facebook.com/v2.6/" + senderPsid,
            qs: {
                access_token: PAGE_ACCESS_TOKEN,
                fields: "first_name,last_name"
            },
            method: "GET"
        }, function(error, response, body) {
            if(error) {
                callback(error);
            } else {
                var bodyObj = JSON.parse(body);
                name = bodyObj.first_name;
                callback(null, name);
            }
        });
    }
};