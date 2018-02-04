var db = require('./database');
var uuid = require('uuid/v1');

module.exports = {
    add (user) {
        user.id = uuid()
        return db.none('INSERT INTO public.users( \
            id, psid, fbid, name, full_name, gender, avatar_url) \
            VALUES (${id}, ${psid}, ${fbId}, ${name}, ${fullName}, ${gender}, ${profilePic});', user)
            .then(_ => user.id)
    },
    getById (id) {
        return db.one('SELECT id, psid, fbid, name, full_name, gender, avatar_url FROM public.users WHERE id = $1', id);
    },
    getByPsid (psid) {
        return db.oneOrNone('SELECT id, psid, fbid, name, full_name, gender, avatar_url FROM public.users WHERE psid = $1', psid);
    },
    getByFbId (fbid) {
        return db.oneOrNone('SELECT id, psid, fbid, name, full_name, gender, avatar_url FROM public.users WHERE fbid = $1', fbid);
    }
}
