create table categories (
    "id" serial not null,
    "name" varchar(128) not null,
    "slug" varchar(255) not null,
    "description" varchar(255),
    "parent" int,
    "sort" int default 0,
    "pricing" boolean default true,
    "hidden" boolean default false,
    constraint "categories_id"
        primary key ("id"),
    constraint "categories_parent"
        foreign key("parent") 
        references categories(id) on update cascade on delete cascade,
    constraint "categories_unique" unique ("slug","parent")
);

create index categories_name_index on categories ((lower(name)));
create index categories_slug_index on categories ((lower(slug)));
create index categories_parent_index on categories (parent);
create index categories_sort_index on categories (sort);
create index categories_hidden_index on categories (hidden);

INSERT
    INTO categories (
        "id",
        "name",
        "slug",
        "description",
        "parent",
        "sort",
        "pricing",
        "hidden"
    )
    VALUES 
        /* LEVEL 0 */
        
        (1, 'Mașini și vehicule', 'masini-si-vehicule', '', NULL, 0, true, false),
        (2, 'De vânzare', 'de-vanzare', '', NULL, 0, true, false),
        (3, 'Proprietăți', 'proprietati', '', NULL, 0, true, false),
        (4, 'Joburi', 'joburi', '', NULL, 0, true, false),
        (5, 'Servicii', 'servicii', '', NULL, 0, true, false),
        (6, 'Comunitate', 'comunitate', '', NULL, 0, true, false),
        (7, 'Animăluțe', 'animalute', '', NULL, 0, true, false),
        (8, 'Lucruri dorite', 'lucruri-dorite', '', NULL, 0, true, false),

        /* PATH 1 */

        (9, 'Mașini', 'masini', '', 1, 0, true, false),
        (10, 'Motociclete și scutere', 'motociclete-si-scutere', '', 1, 0, true, false),
        (11, 'Utilitare', 'utilitare', '', 1, 0, true, false),
        (12, 'Rulote', 'rulote', '', 1, 0, true, false),
        (13, 'Instalații și tractoare', 'instalatii-si-tractoare', '', 1, 0, true, false),
        (14, 'Alte vehicule', 'alte-vehicule', '', 1, 0, true, false),
        (15, 'Accesorii', 'accesorii', '', 1, 0, true, false),
        (16, 'Piese', 'piese', '', 1, 0, true, false),

        /* PATH 1/14 - Accesorii */

        (17, 'Alte accesorii', 'alte-accesorii', '', 14, 0, true, false),
        (18, 'Jante și anvelope', 'jante-si-anvelope', '', 14, 0, true, false),
        (19, 'Haine, căști și cizme', 'haine-casti-si-cizme', '', 14, 0, true, false),
        (20, 'Tuning și stilizare auto', 'tuning-si-silizare-auto', '', 14, 0, true, false),
        (21, 'Accesorii și stil pentru motociclete', 'accesorii-si-stil-pentru-motocicleta', '', 14, 0, true, false),
        (22, 'Audio și GPS în mașină', 'audio-si-gps-in-masina', '', 14, 0, true, false),

        /* PATH 1/15 - Componente */

        (23, 'Piese auto', 'piese-auto', '', 15, 0, true, false),
        (24, 'Piese pentru rulote', 'piese-pentru-rulote', '', 15, 0, true, false),
        (25, 'Piese pentru motociclete și scutere', 'piese-pentru-motociclete-si-scutere', '', 15, 0, true, false),
        (26, 'Piese pentru furgonete', 'piese-pentru-furgonete', '', 15, 0, true, false),
        (27, 'Piese pentru instalații și tractoare', 'piese-pentru-instalatii-si-tractoare', '', 15, 0, true, false),
        (28, 'Piese de camion', 'piese-de-camion', '', 15, 0, true, false),

        /* PATH 2 - De vânzare */

        (29, 'Aparate', 'aparate', '', 2, 0, true, false),
        (30, 'Audio și stereo', 'audio-si-stereo', '', 2, 0, true, false),
        (31, 'Lucruri pentru bebeluși și copii', 'lucruri-pentru-bebelusi-si-copii', '', 2, 0, true, false),
        (32, 'Camere video și echipamente de studio', 'camere-video-si-echipamente-de-studio', '', 2, 0, true, false),
        (33, 'Decorațiuni de Crăciun', 'decoratiuni-de-craciun', '', 2, 0, true, false),
        (34, 'Îmbrăcăminte, încălțăminte și accesorii', 'imbracaminte-incaltaminte-si-accesorii', '', 2, 0, true, false),
        (35, 'Calculatoare și software', 'calculatoare-si-software', '', 2, 0, true, false),
        (36, 'Instrumente și materiale DIY', 'instrumente-si-materiale-diy', '', 2, 0, true, false),
        (37, 'Componente electronice', 'componente-electronice', '', 2, 0, true, false),
        (38, 'Sănătate și frumusețe', 'sanatate-si-frumusete', '', 2, 0, true, false),
        (39, 'Casă și grădină', 'casa-si-gradina', '', 2, 0, true, false),
        (40, 'Curățarea casei', 'curatarea-casei', '', 2, 0, true, false),
        (41, 'Muzică, filme, cărți și jocuri', 'muzica-filme-carti-si-jocuri', '', 2, 0, true, false),
        (42, 'Instrumente muzicale și echipamente DJ', 'instrumente-muzicale-si-echipamente-dj', '', 2, 0, true, false),
        (43, 'Mobilier și echipamente de birou', 'mobilier-si-echipamente-de-birou', '', 2, 0, true, false),
        (44, 'Telefoane, telefoane mobile și telecomunicații', 'telefoane-telefoane-mobile-si-telecomunicatii', '', 2, 0, true, false),
        (45, 'Sport, agrement și călătorii', 'sport-agrement-si-calatorii', '', 2, 0, true, false),
        (46, 'Bilete', 'bilete', '', 2, 0, true, false),
        (47, 'TV, DVD, Blu-ray și videoclipuri', 'tv-dvd-blu-ray-si-videoclipuri', '', 2, 0, true, false),
        (48, 'Jocuri video și console', 'jocuri-video-si-console', '', 2, 0, true, false),
        (49, 'Freebies', 'freebies', '', 2, 0, true, false),
        (50, 'Alte bunuri', 'alte-bunuri', '', 2, 0, true, false),
        (51, 'Lucruri dorite', 'lucruri-dorite', '', 2, 0, true, false),
        (52, 'Magazin de schimb', 'magazin-de-schimb', '', 2, 0, true, false),

        /* PATH 2/29 - De vânzare/Aparate */

        (53, 'Electrocasnice', 'electrocasnice', '', 29, 0, true, false),
        (54, 'Electrocasnice Mici', 'electrocasnice-mici', '', 29, 0, true, false),
        (55, 'Cuptoare și Plite', 'cuptoare-si-plite', '', 29, 0, true, false),
        (56, 'Frigidere Congelatoare', 'frigidere-congelatoare', '', 29, 0, true, false),
        (57, 'Mașini de spălat', 'masini-de-spalat', '', 29, 0, true, false),
        (58, 'Uscătoare de rufe', 'uscatoare-de-rufe', '', 29, 0, true, false),
        (59, 'Alte Aparate', 'alte-aparate', '', 29, 0, true, false),
        (60, 'Aparate pentru sănătate și frumusețe', 'aparate-pentru-sanatate-si-frumusete', '', 29, 0, true, false),
        (61, 'Frigidere', 'frigidere', '', 29, 0, true, false),
        (62, 'Mașini de spălat vase', 'masini-de-spalat-vase', '', 29, 0, true, false),
        (63, 'Congelatoare', 'congelatoare', '', 29, 0, true, false),
        (64, 'Mașină de spălat uscător', 'masina-de-spalat-uscator', '', 29, 0, true, false),
        (65, 'Aparate integrate', 'parate-integrate', '', 29, 0, true, false),

        /* PATH 2/29/53 - De vânzare/Aparate/Electrocasnice */

        (66, 'Aspiratoare', 'aspiratoare', '', 53, 0, true, false),
        (67, 'Aer condiționat și ventilatoare de vânzare', 'aer-conditionat-si-ventilatoare-de-vanzare', '', 53, 0, true, false),
        (68, 'Purificatoare de aer și dezumidificatoare', 'purificatoare-de-aer-si-dezumidificatoare', '', 53, 0, true, false),
        (69, 'Încălzire, incendii și împrejurimi', 'incalzire-incendii-si-imprejurimi', '', 53, 0, true, false),
        (70, 'Fiare de călcat și mese de călcat', 'fiare-de-calcat-si-mese-de-calcat', '', 53, 0, true, false),
        (71, 'Alte Electrocasnice', 'alte-electrocasnice', '', 53, 0, true, false),

        /* PATH 2/29/54 - De vânzare/Aparate/Electrocasnice Mici */

        (72, 'Aparate de cafea', 'aparate-de-cafea', '', 54, 0, true, false),
        (73, 'Fierbătoare și prăjitoare de pâine', 'fierbatoare-si-prajitoare-de-paine', '', 54, 0, true, false),
        (74, 'Friteuze', 'friteuze', '', 54, 0, true, false),
        (75, 'Blendere, procesoare și mixere', 'blendere-procesoare-si-mixere', '', 54, 0, true, false),
        (76, 'Cuptoare cu microunde', 'cuptoare-cu-microunde', '', 54, 0, true, false),
        (77, 'Producători de alimente și băuturi', 'producatori-de-alimente-si-bauturi', '', 54, 0, true, false),
        (78, 'Alte electrocasnice mici', 'alte-electrocasnice-mici', '', 54, 0, true, false),
        (79, 'Prepararea băuturii reci', 'prepararea-bauturii-reci', '', 54, 0, true, false),
        (80, 'Aragaze lente', 'aragaze-lente', '', 54, 0, true, false),
        (81, 'Grătare de sănătate', 'gratare-de-sanatate', '', 54, 0, true, false),
        (82, 'Mașini de pâine', 'masini-de-paine', '', 54, 0, true, false),
        (83, 'Aragaze de orez', 'aragaze-de-orez', '', 54, 0, true, false),

        /* PATH 2/29/55 - De vânzare/Aparate/Cuptoare și Plite */

        (84, 'Alte Cuptoare și Plite', 'alte-cuptoare-si-plite', '', 55, 0, true, false),
        (85, 'Plite de gătit', 'plite-de-gatit', '', 55, 0, true, false),
        (86, 'Plite', 'plite', '', 55, 0, true, false),
        (87, 'Hote și splashbacks', 'hote-si-splashbacks', '', 55, 0, true, false),

        /* PATH 2/29/60 - De vânzare/Aparate/Aparate pentru sănătate și frumusețe */

        (88, 'Aparate de îngrijire și coafare a părului', 'aparate-de-ingrijire-si-coafare-a-parului', '', 60, 0, true, false),
        (89, 'Aparate pentru epilare și epilare cu ceară', 'aparate-pentru-epilare-si-epilare-cu-ceara', '', 60, 0, true, false),
        (90, 'Aparate de îngrijire dentară', 'aparate-de-ingrijire-dentara', '', 60, 0, true, false),
        (91, 'Aparate de masaj și relaxare', 'aparate-de-masaj-si-relaxare', '', 60, 0, true, false),
        
        /* PATH 2/30 - De vânzare/Audio și stereo */

        (92, 'Stereo și accesorii', 'stereo-si-accesorii', '', 30, 0, true, false),
        (93, 'Stereouri personale', 'stereouri-personale', '', 30, 0, true, false),
        (94, 'Alte stereo și audio', 'alte-stereo-si-audio', '', 30, 0, true, false),
        (95, 'Home Cinema', 'home-cinema', '', 30, 0, true, false),
        (96, 'Microfoane', 'microfoane', '', 30, 0, true, false),

        /* PATH 2/30/92 - De vânzare/Audio și stereo/Stereo și accesorii */

        (97, 'Difuzoare', 'difuzoare', '', 92, 0, true, false),
        (98, 'Sisteme stereo (întregi)', 'sisteme-stereo-intregi', '', 92, 0, true, false),
        (99, 'Amperi', 'amperi', '', 92, 0, true, false),
        (100, 'Radiouri', 'radiouri', '', 92, 0, true, false),
        (101, 'CD, casetă și radio (separate)', 'cd-caseta-si-radio-separate', '', 92, 0, true, false),
        (102, 'Playere de discuri/plate turnante', 'playere-de-discuriplate-turnante', '', 92, 0, true, false),
        (103, 'Stereo compacte', 'stereo-compacte', '', 92, 0, true, false),
        (104, 'Alte', 'alte', '', 92, 0, true, false),

        /* PATH 2/30/93 - De vânzare/Audio și stereo/Stereouri personale */

        (105, 'Căști', 'casti', '', 93, 0, true, false),
        (106, 'iPod-uri', 'ipod-uri', '', 93, 0, true, false),
        (107, 'Playere MP3', 'playere-mp3', '', 93, 0, true, false),
        (108, 'Minidisc și Discman', 'minidisc-si-discman', '', 93, 0, true, false),

        /* PATH 2/31 - De vânzare/Lucruri pentru bebeluși și copii */

        (109, 'Jucării', 'jucarii', '', 31, 0, true, false),
        (110, 'Haine, pantofi și accesorii pentru copii', 'haine-pantofi-si-accesorii-pentru-copii', '', 31, 0, true, false),
        (111, 'Mobilier pentru creșă și copii', 'mobilier-pentru-cresa-si-copii', '', 31, 0, true, false),
        (112, 'Cărucioare', 'carucioare', '', 31, 0, true, false),
        (113, 'Scaune auto și marsupiu', 'scaune-auto-si-marsupiu', '', 31, 0, true, false),
        (114, 'Haine pentru copii', 'haine-pentru-copii', '', 31, 0, true, false),
        (115, 'Jucării de exterior', 'jucarii-de-exterior', '', 31, 0, true, false),
        (116, 'Balance pentru copii, balansoare și leagăne', 'balance-pentru-copii-balansoare-si-leagane', '', 31, 0, true, false),
        (117, 'Hrănire', 'hranire', '', 31, 0, true, false),
        (118, 'Siguranța bebelușilor și copiilor', 'siguranta-bebelusilor-si-copiilor', '', 31, 0, true, false),
        (119, 'Schimbarea', 'schimbarea', '', 31, 0, true, false),
        (120, 'Alte', 'alte', '', 31, 0, true, false);