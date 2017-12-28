const request = require('request-promise-native');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = {
    async fetchName(senderPsid) {
        return 
            request({
                url: "https://graph.facebook.com/v2.6/" + senderPsid,
                qs: {
                    access_token: PAGE_ACCESS_TOKEN,
                    fields: "first_name,last_name"
                },
                method: "GET"
            })
            .then(function(response, body) {
                var bodyObj = JSON.parse(body);
                return bodyObj.first_name;
            });
    }
};