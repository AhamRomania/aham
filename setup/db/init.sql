create table users (
    id serial primary key,
    email varchar(255) not null,
    password varchar(255) not null,
    name varchar(255) not null,
    phone varchar(20) not null,
    city integer not null,
    created_at timestamp not null default current_timestamp
);