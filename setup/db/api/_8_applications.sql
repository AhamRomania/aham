create table applications (
    "id" serial not null primary key,
    "owner" integer not null references users(id) on update cascade on delete cascade,
    "name" varchar(255) not null,
    "key" text not null,
    "enabled" boolean default true,
    "created" timestamp not null default current_timestamp
);

CREATE INDEX idx_applications_key ON applications(key);