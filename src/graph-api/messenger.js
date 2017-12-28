const request = require('request');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = {
    send(senderPsid, message, callback) {
        
        const requestBody = {
            "recipient": {
                "id": senderPsid
            },
            "message": message
        };
        
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": requestBody
        }, callback);
    }
};