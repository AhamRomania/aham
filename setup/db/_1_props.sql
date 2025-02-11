
create type metatype as enum (
    'TEXT',
    'NUMBER',
    'SELECT',
    'BOOL',
    'DATE',
    'TIME'
);

create table meta_props (
    "id" serial not null,
    "name" varchar(64) not null,
    "title" varchar(64) not null,
    "group" varchar(32) default 'default', -- group props by key in the view
    "sort" int default 0,
    "required" boolean default false,
    "template" varchar(100),
    "description" varchar(300), --short description of the prop
    "help" varchar(32),--help key
    "type" metatype not null,
    "options" jsonb,
    "microdata" varchar(64),
    constraint "meta_props_id" primary key ("id"),
    constraint "meta_props_name" unique ("name")
);

create table meta_assign (
    "category" bigint not null,
    "meta" int not null,
    constraint "meta_assign_category"
        foreign key("category") 
        references categories(id) on update cascade on delete cascade,
    constraint "meta_assign_meta"
        foreign key("meta") 
        references meta_props(id) on update cascade on delete cascade
);



INSERT INTO meta_props ("id", "name", "title", "group", "description", "help", "type", "options", "sort", "microdata", "template")
    VALUES
        (1, 'brand', 'Brand', 'default', NULL, NULL, 'TEXT', NULL, 1, '', NULL),
        (2, 'color', 'Culoare','default', NULL, NULL, 'TEXT', NULL, 1, '', NULL),
        (3, 'state', 'Stare','default', NULL, NULL, 'SELECT', '{"values":["Nou","Folosit"]}'::json, NULL, '', NULL),
        (4, 'year', 'An fabricație','default', NULL, NULL, 'NUMBER', NULL, 3, '', NULL),
        (5, 'car_engine_capacity', 'Capacitate motor','default', NULL, NULL, 'NUMBER', NULL, NULL, '', NULL),
        (6, 'surface', 'Suprafață','default', NULL, NULL, 'NUMBER', NULL, NULL, '', NULL),
        (7, 'rooms', 'Numar camere','default', NULL, NULL, 'NUMBER', NULL, NULL, '', NULL),
        (8, 'floor', 'Etaj','default', NULL, NULL, 'NUMBER', NULL, NULL, '', NULL),
        (9, 'flat_layout', 'Compartimentare','default', NULL, NULL, 'SELECT', '{"values":["Decomandat","Semidecomandat"]}'::json, NULL, '', NULL),
        (10, 'flat_has_heating', 'Are centrală','default', NULL, NULL, 'BOOL', NULL, NULL, '', NULL),
        (11, 'flat_has_furniture', 'Este mobilat','default', NULL, NULL, 'BOOL', NULL, NULL, '', NULL),
        (12, 'flat_has_cooling', 'Are climă','default', NULL, NULL, 'BOOL', NULL, NULL, '', NULL),
        (13, 'shoe_size', 'Mărime','default', NULL, NULL, 'NUMBER', NULL, NULL, '', NULL),
        (14, 'cloth_size', 'Mărime','default', NULL, NULL, 'SELECT', '{"values":["XXS","XS","S","M","L","XL","XXL","XXXL"]}'::json, NULL, '', NULL),
        (15, 'car_model', 'Model','default', NULL, NULL, 'TEXT', NULL, 2, '', NULL),
        (16, 'material', 'Material','default', NULL, NULL, 'TEXT', NULL, NULL, '', NULL),
        (17, 'car_km', 'Km','default', NULL, NULL, 'NUMBER', NULL, NULL, '', NULL),
        (18, 'car_fuel', 'Combustibil','default', NULL, NULL, 'SELECT', '{"values":["Benzină","Benzină + CNG","Benzină + GPL","Diesel","Electric","Etanol","Hibrid","Hidrogen"]}'::json, 0, 'fuelType', NULL),
        (19, 'car_version', 'Versiune','default', NULL, NULL, 'TEXT', NULL, NULL, '', NULL),
        (20, 'car_generation', 'Generatie','default', NULL, NULL, 'TEXT', NULL, NULL, '', NULL),
        (21, 'car_power', 'Putere', 'default', NULL, NULL, 'NUMBER', NULL, NULL, '', '@ CP'),
        (22, 'car_cc', 'Capacitate Cilindrică', 'default', NULL, NULL, 'NUMBER', NULL, 0, '', '@ cm3'),
        (23, 'car_shape', 'Tip Caroserie', 'default', NULL, NULL, 'SELECT', '{"values":["Cabrio","Combi","Compacta","Coupe","Masina de oras","Masina mica","Monovolum","Sedan","Suv"]}'::json, NULL, 'bodyType', NULL),
        (24, 'car_country_origin', 'Tara de origine', 'default', NULL, NULL, 'TEXT', NULL, 0, 'countryOfOrigin', NULL),
        (25, 'car_emissions_co2', 'Emisii CO2', 'default', NULL, NULL, 'NUMBER', NULL, 0, 'emissionsCO2', NULL),
        (26, 'car_doors_number', 'Numar de usi', 'default', NULL, NULL, 'NUMBER', NULL, 0, 'numberOfDoors', NULL),
        (27, 'car_model_date', 'Data model', 'default', NULL, NULL, 'DATE', NULL, 0, 'modelDate', NULL),
        (28, 'car_fuel_consumption', 'Consum', 'default', NULL, NULL, 'NUMBER', NULL, 0, 'fuelConsumption', '@ l/100km');

/*
INSERT INTO meta_assign (category, meta)
    VALUES
        -- Vehicule
        (1,1),(1,2),(1,3),(1,4),(1,5),(1,15),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),
        -- Proprietati de inchiriat/vanzare
        (2,4),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),
        (16,4),(16,6),(16,7),(16,8),(16,9),(16,10),(16,11),(16,12),
        -- Cloth
        (4,1),(4,2),(4,3),(4,14);
*/
