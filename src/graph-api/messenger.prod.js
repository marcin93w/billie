const request = require('request-promise');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = {
    send(receiverPsid, message) {
        
        const requestBody = {
            "recipient": {
                "id": receiverPsid
            },
            "message": message
        };
        
        return request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": requestBody
        });
    }
};