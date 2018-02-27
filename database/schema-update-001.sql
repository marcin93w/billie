ALTER TABLE public.debts
    ADD COLUMN is_canceled boolean DEFAULT false NOT NULL;

ALTER TABLE public.debts
    ADD COLUMN canceled_by_creator boolean;
    
ALTER TABLE public.debts
    ADD COLUMN comment text;

ALTER TABLE public.pending_debts
    ADD COLUMN is_canceled boolean DEFAULT false NOT NULL;

ALTER TABLE public.pending_debts
    ADD COLUMN canceled_by_creator boolean;

ALTER TABLE public.pending_debts
    ADD COLUMN comment text;
    