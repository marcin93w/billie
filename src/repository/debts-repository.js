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
        return db.any('SELECT d.id, d.user2 as user, d.thread_id, d.debt_type, d.amount::money::numeric::float8, d.date, TRUE as is_user1, u.full_name, u.avatar_url \
                FROM public.debts d \
                LEFT JOIN public.users u on(d.user2 = u.id) \
                WHERE user1 = $1 \
            UNION \
            SELECT d.id, d.user1 as user, d.thread_id, d.debt_type, d.amount::money::numeric::float8, d.date, FALSE as is_user1, u.full_name, u.avatar_url \
                FROM public.debts d \
                LEFT JOIN public.users u on(d.user1 = u.id) \
                WHERE user2 = $1;', userId)
    },
    getDebts (user1, user2) {
        return db.any('SELECT case when user1 = $1 then 1 else 2 end as which_user, amount::money::numeric::float8, date, debt_type \
		FROM public.debts \
		WHERE (user1 = $1 AND user2 =  $2) \
        OR (user1 = $2 AND user2 = $1) \
        ORDER BY date DESC;', [user1, user2]);
    }
};