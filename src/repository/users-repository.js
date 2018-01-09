var users = [];

module.exports = {
    add (user) {
        user.id = users.length
        users.push(user)
        return user.id
    },
    getById (id) {
        return users[id]
    },
    getByPsid (psid) {
        return users.find(u => u.psid == psid)
    },
    getByFbId (fbid) {
        return users.find(u.fbid == fbid)
    },
    updateByPsid (psid, props) {
        const user = this.getByPsid(psid)
        if (user) {
            Object.assign(user, props);
            return true;
        } else {
            return false;
        }
    }
}
