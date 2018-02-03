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

CREATE TABLE public.users_debts
(
    user1 uuid NOT NULL,
    user2 uuid,
    is_user1 boolean,
    debt money NOT NULL,
    PRIMARY KEY (user1, user2)
)
WITH (
    OIDS = FALSE
);