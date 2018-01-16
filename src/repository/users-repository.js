var db = require('./database');
var uuid = require('uuid/v1');

module.exports = {
    add (user) {
        user.id = uuid()
        return db.none('INSERT INTO public.users( \
            id, psid, fbid, name, full_name, gender) \
            VALUES (${id}, ${psid}, ${fbId}, ${name}, ${fullName}, ${gender});', user)
            .then(_ => user.id)
    },
    getById (id) {
        return db.one('SELECT id, psid, fbid, name, full_name, gender FROM public.users WHERE id = $1', id);
    },
    getByPsid (psid) {
        return db.oneOrNone('SELECT id, psid, fbid, name, full_name, gender FROM public.users WHERE psid = $1', psid);
    },
    getByFbId (fbid) {
        return db.oneOrNone('SELECT id, psid, fbid, name, full_name, gender FROM public.users WHERE fbid = $1', fbid);
    }
}
