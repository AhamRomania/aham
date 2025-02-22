create table notifications (
    "id" serial not null primary key,
    "user" integer not null references users(id),
    "variant" varchar(64) not null default 'info',
    "title" varchar(255) not null,
    "contents" text,
    "href" text,
    "actions" json,
    "seen" timestamp,
    "created" timestamp not null default current_timestamp,
    check (variant in ('info', 'alert', 'warning', 'error', 'fatal','system','promotion'))
);