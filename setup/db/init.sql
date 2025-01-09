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
    created_at timestamp not null default current_timestamp
);

insert into counties (name) values ('Cluj'), ('Timiș'), ('Alba');
insert into cities (name, county) values ('Cluj-Napoca', 1), ('Timișoara', 2), ('Alba Iulia', 3);