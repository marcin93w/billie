const request = require('request-promise');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = {
    fetchName: (senderPsid) => {
        return request({
                url: "https://graph.facebook.com/v2.6/" + senderPsid,
                qs: {
                    access_token: PAGE_ACCESS_TOKEN,
                    fields: "first_name,last_name"
                },
                method: "GET"
            })
            .then(function(response, body) {
                console.log(JSON.stringify(response));
                return body.first_name;
            });
    }
};