var db = require('./database');
var uuid = require('uuid/v1');

module.exports = {
    add (debt) {
        debt.id = uuid()
        return db.none('INSERT INTO public.debts( \
            id, user1, thread_id, debt_type, amount, date) \
            VALUES (${id}, ${user1}, ${threadId}, ${debtType}, ${amount}, ${date});', debt)
            .then(_ => debt.id)
    },
    get (id) {
        return db.one('SELECT user1, user2, thread_id, debt_type, amount, date FROM public.debts WHERE id = $1', id);
    },
    updateSecondUser (id, user2) {
        return db.none('UPDATE public.debts \
            SET user2=$2 \
            WHERE id = $1;', [id, user2])
    },
    getAll () {
        return db.any('SELECT user1, user2, thread_id, debt_type, amount, date FROM public.debts');
    }
};