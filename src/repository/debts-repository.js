var db = require('./database');
var uuid = require('uuid/v1');

module.exports = {
    add (debt) {
        debt.id = uuid()
        return db.none('INSERT INTO public.debts( \
            id, user1, user2, thread_id, debt_type, amount, date) \
            VALUES (${id}, ${user1}, ${user2}, ${threadId}, ${debtType}, ${amount}, ${date});', debt)
            .then(_ => debt.id)
    },
    get (id) {
        return db.one('SELECT user1, user2, thread_id, debt_type, amount::money::numeric::float8, date FROM public.debts WHERE id = $1', id);
    },
    updateSecondUserByThreadId (threadId, user2) {
        return db.none('UPDATE public.debts \
            SET user2=$2 \
            WHERE thread_id = $1 AND user1 != $2;', [threadId, user2])
    },
    remove (id, userId) {
        return db.none('DELETE FROM public.debts WHERE id = $1 AND user1 = $2;', [id, userId])
    },
    getUserDebts (userId) {
        return db.any('SELECT id, user2 as user, thread_id, debt_type, amount::money::numeric::float8, date \
                FROM public.debts \
                WHERE user1 = $1 \
            UNION \
            SELECT id, user1 as user, thread_id, 1-debt_type, amount::money::numeric::float8, date \
                FROM public.debts \
                WHERE user2 = $1;', userId)
    }
};