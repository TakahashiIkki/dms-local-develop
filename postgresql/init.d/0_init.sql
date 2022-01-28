\c pg_dms
SET search_path = public;

DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS "user";

create table "user"
(
    id SERIAL PRIMARY KEY,
    created_at timestamp with time zone NOT NULL
);

create table member
(
    user_id integer PRIMARY KEY
        constraint member_fk_user_id
        references "user"
        deferrable initially deferred,
    name       varchar(25)              not null,
    created_at timestamp with time zone not null
);
