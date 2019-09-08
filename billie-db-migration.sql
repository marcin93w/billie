--users
select row_to_json(t) from
(SELECT psid as id, name, full_name as fullName, gender, avatar_url as avatarUrl
	FROM public.users) t
	
--debt-ledgers
select row_to_json(l) from
(select ledgers.*, db.amount as balance 
from (SELECT 
       d.thread_id as threadId, 
       user1 as hostUserId, 
       user2 as guestUserId, 
       json_agg(json_build_object('type', debt_type, 'amount', amount, 'date', date, 'comment', comment)) as debts 
	FROM (SELECT thread_id, user1, user2, amount, debt_type, date, comment 
      	from public.debts 
      	where (is_canceled IS NULL OR is_canceled != true) AND 
        	(canceled_by_creator IS NULL OR canceled_by_creator != true )) d
    group by thread_id, user1, user2) ledgers
left join debt_balances db on (db.user1_id = ledgers.hostuserid AND db.user2_id = ledgers.guestuserid)) l
--ledger without balance needs to be reversed and merged to existing ones


--pending-debt-ledgers
select row_to_json(l) from
(SELECT 
		user_id as hostUserId, 
        thread_id as threadId, 
        SUM(CASE WHEN debt_type = 0 THEN amount::money::numeric::float8 ELSE -(amount::money::numeric::float8) END) as balance, 
        json_agg(json_build_object('type', debt_type, 'amount', amount, 'date', date, 'comment', comment)) as debts
	FROM public.pending_debts
    where (is_canceled IS NULL OR is_canceled != true)
    group by user_id, thread_id) l