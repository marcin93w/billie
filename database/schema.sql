CREATE TABLE public.users
(
    id uuid NOT NULL,
    psid character varying(50) NOT NULL,
    fbid character varying(50),
    name text,
    full_name text,
    gender text,
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.users
    OWNER to postgres;