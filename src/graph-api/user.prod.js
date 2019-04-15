const request = require('request-promise');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = {
    fetchUserData: (senderPsid) => {
        return request({
                url: "https://graph.facebook.com/v2.6/" + senderPsid,
                qs: {
                    access_token: PAGE_ACCESS_TOKEN
                },
                method: "GET"
            })
            .then(function(body) {
                const bodyObj = JSON.parse(body);
                return { 
                    id: bodyObj.id, 
                    name: bodyObj.first_name,
                    fullName: `${bodyObj.first_name} ${bodyObj.last_name}`,
                    profilePic: bodyObj.profile_pic
                };
            });
    }
};