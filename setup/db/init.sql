create table counties (
    id serial primary key,
    name varchar(255) not null,
    unique (name)
);

create table cities (
    id serial primary key,
    name varchar(255) not null,
    county integer not null,
    foreign key (county) references counties(id),
    unique (name, county)
);

create table users (
    id serial primary key,
    email varchar(255) not null,
    password varchar(255) not null,
    name varchar(255) not null,
    phone varchar(20) not null,
    city integer not null references cities(id),
    email_activation_token varchar(255),
    phone_activation_token varchar(255),
    created_at timestamp not null default current_timestamp,
    email_activated_at timestamp,
    phone_activated_at timestamp
);

create table reports (
    id serial primary key,
    reporter integer references users(id),
    reporter_name varchar(255) not null,
    reporter_email varchar(255) not null,
    reference varchar(2000) not null,
    reason varchar(255) not null,
    comments text not null,
    navitator varchar(255) not null,
    ip varchar(255) not null,
    created_at timestamp not null default current_timestamp,
    status varchar(20) not null default 'pending',
    foreign key (reporter) references users(id),
    check (status in ('pending', 'approved', 'rejected')),
    check (reason in ('inappropriate', 'spam', 'other')),
    unique (reference,reason,comments,navitator,ip)
);

insert into counties (name) values ('Cluj'), ('Timiș'), ('Alba');
insert into cities (name, county) values ('Cluj-Napoca', 1), ('Timișoara', 2), ('Alba Iulia', 3);