var db = require('./database');
var uuid = require('uuid/v1');

module.exports = {
    updateDebt (user1, user2, amount) {
        return db.none('INSERT INTO public.debt_balances (user1_id, user2_id, amount) \
        VALUES ($1, $2, $3) \
        ON CONFLICT (user1_id, user2_id) DO UPDATE \
        SET amount = (debt_balances.amount::money::numeric::float8 + $3)::float8::numeric::money;', [user1, user2, amount]) 
    }
};