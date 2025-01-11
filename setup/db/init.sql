CREATE TYPE currency AS ENUM ('RON', 'EUR', 'USD');

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
    password varchar(255),
    given_name varchar(255) not null,
    family_name varchar(255) not null,
    phone varchar(20),
    city integer references cities(id),
    picture varchar(255),
    email_activation_token varchar(255),
    phone_activation_token varchar(255),
    created_at timestamp not null default current_timestamp,
    email_activated_at timestamp,
    phone_activated_at timestamp
);

create table categories (
    id serial primary key,
    name varchar(255) not null,
    parent integer references categories(id),
    unique (name)
);

create table ads (
    id serial primary key,
    title varchar(255) not null,
    description text not null,
    category integer not null references categories(id),
    poster integer not null references users(id),
    city integer not null references cities(id),
    coordinates point,
    price integer not null,
    currency currency not null,
    created_at timestamp not null default current_timestamp,
    status varchar(20) not null default 'active',
    check (status in ('active', 'inactive'))
);

create table reports (
    id serial primary key,
    reporter integer references users(id),
    reporter_name varchar(255),
    reporter_email varchar(255),
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
    unique (reporter_email,reference,reason,comments,navitator,ip)
);

CREATE INDEX reports_index ON reports(reporter,reason,status);

insert into counties (name) values ('Cluj'), ('Timiș'), ('Alba');
insert into cities (name, county) values ('Cluj-Napoca', 1), ('Timișoara', 2), ('Alba Iulia', 3);

insert into categories (id, name, parent) values (1, 'Electronice', NULL), (2, 'Imobiliare', NULL), (3, 'Auto', 1), (4, 'Telefoane', 1), (5, 'Laptopuri', 1), (6, 'Apartamente', 2), (7, 'Case', 2), (8, 'Terenuri', 2);