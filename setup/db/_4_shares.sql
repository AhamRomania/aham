create table shares (
    id serial primary key,
    ad_id integer not null references ads(id),
    description text,
    platforms jsonb not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
)