CREATE TABLE public.users
(
    id uuid NOT NULL,
    psid character varying(50) NOT NULL,
    fbid character varying(50),
    name text,
    full_name text,
    gender text,
    avatar_url text,
    PRIMARY KEY (id),
    CONSTRAINT psuser UNIQUE (psid),
    CONSTRAINT fbuser UNIQUE (fbid)
)
WITH (
    OIDS = FALSE
);

CREATE TABLE public.user_threads
(
    thread_id character varying(50) NOT NULL,
    user_id uuid NOT NULL,
    is_group boolean,
    CONSTRAINT user_thread UNIQUE (user_id, thread_id)
)
WITH (
    OIDS = FALSE
);

CREATE TABLE public.debts
(
    id uuid NOT NULL,
    user1 uuid NOT NULL,
    user2 uuid,
    thread_id character varying(50),
    debt_type smallint NOT NULL,
    amount money NOT NULL,
    date timestamp with time zone NOT NULL,
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

CREATE TABLE public.debt_balances
(
    user1_id uuid NOT NULL,
    user2_id uuid NOT NULL,
    amount money,
    CONSTRAINT pk PRIMARY KEY (user1_id, user2_id),
    CONSTRAINT user1 FOREIGN KEY (user1_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT user2 FOREIGN KEY (user2_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

CREATE INDEX fki_user1
    ON public.debt_balances USING btree
    (user1_id)
    TABLESPACE pg_default;

CREATE INDEX fki_user2
    ON public.debt_balances USING btree
    (user2_id)
    TABLESPACE pg_default;

CREATE TABLE public.pending_debts
(
    id uuid,
    user_id uuid,
    thread_id character varying(50),
    amount money,
    date timestamp with time zone,
    debt_type smallint,
    PRIMARY KEY (id),
    CONSTRAINT "user" FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
);

