const userGraphApi = require('./graph-api/user.js');

var users = [];

module.exports = {
    getUserData: (psid) => {
        var user = users[psid];
        if (user) {
            return Promise.resolve(user);
        }

        return userGraphApi.fetchName(psid)
            .then(userData => users[psid] = userData);
    }
};