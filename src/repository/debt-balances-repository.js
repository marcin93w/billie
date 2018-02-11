"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("./database");
class DebtBalancesRepository {
    updateDebt(user1, user2, amount) {
        return db.none('INSERT INTO public.debt_balances (user1_id, user2_id, amount) \
            VALUES ($1, $2, $3) \
            ON CONFLICT (user1_id, user2_id) DO UPDATE \
            SET amount = (debt_balances.amount::money::numeric::float8 + $3)::float8::numeric::money;', [user1, user2, amount]);
    }
    getUserBalances(userId) {
        return db.any('SELECT users.id as user_id, name, full_name, gender, avatar_url, amount \
            FROM \
            (SELECT \
                CASE WHEN user1_id = $1 THEN user2_id ELSE user1_id END as id, \
                SUM(CASE WHEN user1_id = $1 THEN amount::money::numeric::float8 ELSE -amount::money::numeric::float8 END) as amount \
                FROM public.debt_balances \
                WHERE user1_id = $1 OR user2_id = $1 \
                GROUP BY id) as balances \
            JOIN public.users on (users.id = balances.id)', userId);
    }
    getUsersBalance(userId, contactId) {
        return db.oneOrNone('SELECT \
            SUM(CASE WHEN user1_id = $1 THEN amount::money::numeric::float8 ELSE -amount::money::numeric::float8 END) as amount \
            FROM public.debt_balances \
            WHERE \
                (user1_id = $1 AND user2_id = $2) OR \
                (user2_id = $1 AND user1_id = $2)', [userId, contactId]);
    }
}
exports.default = DebtBalancesRepository;
;
//# sourceMappingURL=debt-balances-repository.js.map