import * as db from './database';
import * as uuid from 'uuid/v1';
import { Debt, PendingDebt } from './types/entities';

export default class DebtsRepository {
    add (debt: Debt) : Promise<string> {
        debt.id = uuid()
        return db.none('INSERT INTO public.debts( \
                id, user1, user2, thread_id, debt_type, amount, date) \
                VALUES (${id}, ${user1}, ${user2}, ${threadId}, ${debtType}, ${amount}, ${date});', debt)
            .then(() => debt.id)
    }
    
    addPending (debt: PendingDebt) : Promise<string> {
        debt.id = uuid()
        return db.none('INSERT INTO public.pending_debts( \
                id, user_id, thread_id, amount, date, debt_type) \
                VALUES (${id}, ${userId}, ${threadId}, ${amount}, ${date}, ${debtType});', debt)
            .then(() => debt.id)
    }

    getPending(id: string) : Promise<PendingDebt> {
        return db.one('SELECT id, user_id, thread_id, amount::money::numeric::float8, date, debt_type \
                FROM public.pending_debts \
                WHERE id = $1;', id)
    }
    
    getPendingDebtsByThreadId(threadId: string) : Promise<PendingDebt[]> {
        return db.any('SELECT id, user_id, thread_id, amount::money::numeric::float8, date, debt_type \
                FROM public.pending_debts \
                WHERE thread_id = $1;', threadId)
    }

    getThreadPendingDebtsBalance(threadId: string) : Promise<{amount: number}> {
        return db.oneOrNone('SELECT \
                SUM(CASE WHEN debt_type = 0 THEN amount::money::numeric::float8 ELSE -amount::money::numeric::float8 END) as amount \
                FROM public.pending_debts \
                WHERE thread_id = $1;', threadId)
    }

    getPendingDebtsBalancesForUser(userId: string) : Promise<{threadId: string, amount: number}[]> {
        return db.any('SELECT \
                thread_id, \
                SUM(CASE WHEN debt_type = 0 THEN amount::money::numeric::float8 ELSE -amount::money::numeric::float8 END) as amount \
                FROM public.pending_debts \
                WHERE user_id = $1 \
                GROUP BY thread_id;', userId);
    }
    
    removePendingDebtById(id: string) : Promise<null> {
        return db.none('DELETE FROM public.pending_debts \
                WHERE id = $1;', id)
    }
    
    get (id) {
        return db.one('SELECT user1, user2, thread_id, debt_type, amount::money::numeric::float8, date FROM public.debts WHERE id = $1', id);
    }
    getDebtsByThreadId (threadId) {
        return db.any('SELECT user1, user2, debt_type, amount::money::numeric::float8, date FROM public.debts WHERE thread_id = $1', threadId)
    }
    remove (id) {
        return db.none('DELETE FROM public.debts WHERE id = $1;', id)
    }
    getDebts (user1, user2) {
        return db.any('SELECT case when user1 = $1 then 1 else 2 end as which_user, amount::money::numeric::float8, date, debt_type \
        FROM public.debts \
        WHERE (user1 = $1 AND user2 =  $2) \
        OR (user1 = $2 AND user2 = $1) \
        ORDER BY date DESC;', [user1, user2]);
    }
}