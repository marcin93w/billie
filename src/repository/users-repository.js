"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("./database");
const uuid = require("uuid/v1");
class UsersRepository {
    add(user) {
        user.id = uuid();
        return db.none('INSERT INTO public.users( \
            id, psid, fbid, name, full_name, gender, avatar_url) \
            VALUES (${id}, ${psid}, ${fbId}, ${name}, ${fullName}, ${gender}, ${profilePic});', user)
            .then(_ => user.id);
    }
    getById(id) {
        return db.one('SELECT id, psid, fbid, name, full_name, gender, avatar_url, bank_account_number FROM public.users WHERE id = $1', id);
    }
    getByPsid(psid) {
        return db.oneOrNone('SELECT id, psid, fbid, name, full_name, gender, avatar_url, bank_account_number FROM public.users WHERE psid = $1', psid);
    }
    getByFbId(fbid) {
        return db.oneOrNone('SELECT id, psid, fbid, name, full_name, gender, avatar_url, bank_account_number FROM public.users WHERE fbid = $1', fbid);
    }
}
exports.default = UsersRepository;
//# sourceMappingURL=users-repository.js.map