create table categories (
    "id" serial primary key,
    "name" varchar(128) not null,
    "slug" varchar(255) not null,
    "description" varchar(255) default '',
    "parent" INTEGER,  -- Allow parent to be NULL for root categories
    "sort" int not null default 0,
    "pricing" boolean default true,
    "hidden" boolean default false
);

CREATE UNIQUE INDEX idx_unique_category
ON categories ("name", "slug", COALESCE("parent", -1));

ALTER TABLE categories
ADD CONSTRAINT fk_parent_category  -- Better name for the constraint
FOREIGN KEY (parent) REFERENCES categories(id) ON DELETE CASCADE;

create index categories_name_index on categories ((lower(name)));
create index categories_slug_index on categories ((lower(slug)));
create index categories_parent_index on categories (parent);
create index categories_sort_index on categories (sort);
create index categories_hidden_index on categories (hidden);

CREATE OR REPLACE FUNCTION get_category_path(category_id INT)  
RETURNS TEXT AS $$  
WITH RECURSIVE category_path AS (  
    SELECT "id", "name", "slug", "parent", name::TEXT AS path  
    FROM categories  
    WHERE id = category_id  

    UNION ALL  

    SELECT c.id, c.name, c.slug, c.parent, c.name || ' > ' || cp.path  
    FROM categories c  
    JOIN category_path cp ON c.id = cp.parent
)  
SELECT path FROM category_path  
WHERE parent IS NULL  
LIMIT 1;  
$$ LANGUAGE SQL;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS fk_parent_category;
DROP INDEX IF EXISTS public.idx_unique_category;
DROP INDEX IF EXISTS public.categories_sort_index;
DROP INDEX IF EXISTS public.categories_slug_index;
DROP INDEX IF EXISTS public.categories_parent_index;
DROP INDEX IF EXISTS public.categories_name_index;
DROP INDEX IF EXISTS public.categories_hidden_index;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    slug character varying(255) NOT NULL,
    description character varying(255) DEFAULT ''::character varying,
    parent integer,
    sort integer DEFAULT 0 NOT NULL,
    pricing boolean DEFAULT true,
    hidden boolean DEFAULT false
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1, 'Mașini și vehicule', 'masini-si-vehicule', '', NULL, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (2, 'De vânzare', 'de-vanzare', '', NULL, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (3, 'Proprietăți', 'proprietati', '', NULL, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (4, 'Locuri de muncă', 'locuri-de-munca', '', NULL, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (5, 'Servicii', 'servicii', '', NULL, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (6, 'Comunitate', 'comunitate', '', NULL, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (7, 'Pets', 'pets', '', NULL, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (8, 'Mașini', 'masini', '', 1, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (9, 'Motociclete și scutere', 'motociclete-si-scutere', '', 1, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (10, 'Furgonete', 'furgonete', '', 1, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (11, 'Rulote', 'rulote', '', 1, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (12, 'Camioane', 'camioane', '', 1, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (13, 'Tractoare', 'tractoare', '', 1, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (14, 'Alte Vehicule', 'alte-vehicule', '', 1, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (15, 'Accesorii', 'accesorii', '', 1, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (16, 'Piese', 'piese', '', 1, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (17, 'Dorite', 'dorite', '', 1, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (18, 'Piese auto', 'piese-auto', '', 16, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (19, 'Piese pentru rulotă', 'piese-pentru-rulota', '', 16, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (20, 'Piese pentru motociclete și scutere', 'piese-pentru-motociclete-si-scutere', '', 16, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (21, 'Piese pentru tractoare', 'piese-pentru-tractoare', '', 16, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (22, 'Piese pentru camioane', 'piese-pentru-camioane', '', 16, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (23, 'Piese camionete', 'piese-camionete', '', 16, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (24, 'Casă și grădină', 'casa-si-gradina', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (25, 'Haine, încălțăminte și accesorii', 'haine-incaltaminte-si-accesorii', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (26, 'Lucruri pentru bebeluși și copii', 'lucruri-pentru-bebelusi-si-copii', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (27, 'Sport, agrement și călătorii', 'sport-agrement-si-calatorii', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (28, 'Instrumente și materiale de bricolaj', 'instrumente-si-materiale-de-bricolaj', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (29, 'Alte Bunuri', 'alte-bunuri', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (30, 'Muzică, filme, cărți și jocuri', 'muzica-filme-carti-si-jocuri', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (31, 'Aparate', 'aparate', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (32, 'Calculatoare și software', 'calculatoare-si-software', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (33, 'Telefoane, telefoane mobile și telecomunicații', 'telefoane-telefoane-mobile-si-telecomunicatii', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (34, 'Sănătate și frumusețe', 'sanatate-si-frumusete', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (35, 'Mobilier și echipamente de birou', 'mobilier-si-echipamente-de-birou', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (36, 'Instrumente muzicale și echipamente DJ', 'instrumente-muzicale-si-echipamente-dj', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (37, 'TV, DVD, Blu-Ray și videoclipuri', 'tv-dvd-blu-ray-si-videoclipuri', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (38, 'Audio & Stereo', 'audio-and-stereo', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (39, 'Jocuri video și console', 'jocuri-video-si-console', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (40, 'Camere, camere video și echipamente de studio', 'camere-camere-video-si-echipamente-de-studio', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (41, 'Lichidarea casei', 'lichidarea-casei', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (42, 'Decoratiuni de Craciun', 'decoratiuni-de-craciun', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (43, 'Freebiuri', 'freebiuri', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (44, 'Lucruri dorite', 'lucruri-dorite', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (45, 'Bilete', 'bilete', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (46, 'Magazin de schimburi', 'magazin-de-schimburi', '', 2, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (47, 'Sufragerie, mobilier de living', 'sufragerie-mobilier-de-living', '', 24, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (48, 'Alte bunuri de uz casnic', 'alte-bunuri-de-uz-casnic', '', 24, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (49, 'Paturi & Mobila Dormitor', 'paturi-si-mobila-dormitor', '', 24, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (50, 'Ustensile de bucătărie și accesorii', 'ustensile-de-bucatarie-si-accesorii', '', 24, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (51, 'Grădină și terasă', 'gradina-si-terasa', '', 24, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (52, 'Canapele, fotolii și apartamente', 'canapele-fotolii-si-apartamente', '', 47, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (53, 'Oglinzi, ceasuri și ornamente', 'oglinzi-ceasuri-si-ornamente', '', 47, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (54, 'Picturi și poze', 'picturi-si-poze', '', 47, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (55, 'Alte', 'alte', '', 47, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (56, 'Mese și scaune de sufragerie', 'mese-si-scaune-de-sufragerie', '', 47, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (57, 'Iluminat și fitinguri', 'iluminat-si-fitinguri', '', 47, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (58, 'Scaune, taburete și alte scaune', 'scaune-taburete-si-alte-scaune', '', 47, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (59, 'Măsuţă de cafea', 'masuta-de-cafea', '', 47, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (60, 'Covoare și podele', 'covoare-si-podele', '', 47, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (61, 'Perdele, jaluzele și ferestre', 'perdele-jaluzele-si-ferestre', '', 47, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (62, 'Canapele extensibile și futon', 'canapele-extensibile-si-futon', '', 47, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (63, 'Veselă', 'vesela', '', 47, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (64, 'Dulapuri, rafturi și depozitare', 'dulapuri-rafturi-si-depozitare', '', 49, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (65, 'Paturi duble', 'paturi-duble', '', 49, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (66, 'Comode și cufere', 'comode-si-cufere', '', 49, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (67, 'Paturi de o persoană', 'paturi-de-o-persoana', '', 49, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (68, 'Lenjerie de pat și lenjerie de pat', 'lenjerie-de-pat-si-lenjerie-de-pat', '', 49, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (69, 'Noptiere', 'noptiere', '', 49, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (70, 'Saltele', 'saltele', '', 49, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (71, 'Alte mobiliere pentru dormitor și accesorii', 'alte-mobiliere-pentru-dormitor-si-accesorii', '', 49, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (72, 'Cufere', 'cufere', '', 49, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (73, 'Clădire și decorare a grădinii', 'cladire-si-decorare-a-gradinii', '', 51, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (74, 'Mobilier și decor exterior', 'mobilier-si-decor-exterior', '', 51, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (75, 'Grătare și încălzitoare de exterior', 'gratare-si-incalzitoare-de-exterior', '', 51, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (76, 'Mobilier de grădină și terasă', 'mobilier-de-gradina-si-terasa', '', 51, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (77, 'Mașini de tuns iarba și trimmere', 'masini-de-tuns-iarba-si-trimmere', '', 51, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (78, 'Furtunuri', 'furtunuri', '', 51, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (79, 'Ghivece și ornamente', 'ghivece-si-ornamente', '', 73, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (80, 'Plante și flori', 'plante-si-flori', '', 73, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (81, 'Garduri', 'garduri', '', 73, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (82, 'Alte clădiri și decorațiuni pentru grădină', 'alte-cladiri-si-decoratiuni-pentru-gradina', '', 73, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (83, 'Magazii', 'magazii', '', 73, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (84, 'Portițe', 'portite', '', 73, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (85, 'Pavaj', 'pavaj', '', 73, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (86, 'Alte grădină și terasă', 'alte-gradina-si-terasa', '', 73, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (87, 'Sere, magazii și foișoare', 'sere-magazii-si-foisoare', '', 73, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (88, 'Iazuri și fântâni', 'iazuri-si-fantani', '', 73, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (89, 'Seră', 'sera', '', 73, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (90, 'Butelii de gaz', 'butelii-de-gaz', '', 75, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (91, 'Grătare', 'gratare', '', 75, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (92, 'Arzătoare pe lemne', 'arzatoare-pe-lemne', '', 75, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (93, 'Șeminee și încălzitoare de terasă în aer liber', 'seminee-si-incalzitoare-de-terasa-in-aer-liber', '', 75, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (94, 'Cadă cu hidromasaj', 'cada-cu-hidromasaj', '', 76, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (95, 'Mobilier de grădină', 'mobilier-de-gradina', '', 76, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (96, 'Foișoare și copertine', 'foisoare-si-copertine', '', 76, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (97, 'Alte mobiliere de grădină', 'alte-mobiliere-de-gradina', '', 76, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (98, 'Umbrele de soare', 'umbrele-de-soare', '', 76, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (99, 'Scaune', 'scaune', '', 76, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (100, 'Seturi de mobilier', 'seturi-de-mobilier', '', 76, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (101, 'Bănci', 'banci', '', 76, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (102, 'Hamace', 'hamace', '', 76, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (103, 'Îmbrăcăminte pentru femei', 'imbracaminte-pentru-femei', '', 25, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (104, 'Îmbrăcăminte pentru bărbați', 'imbracaminte-pentru-barbati', '', 25, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (105, 'Pantofi de damă', 'pantofi-de-dama', '', 25, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (106, 'Accesorii pentru damă', 'accesorii-pentru-dama', '', 25, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (107, 'Bijuterii', 'bijuterii', '', 25, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (108, 'Încălțăminte și ghete pentru bărbați', 'incaltaminte-si-ghete-pentru-barbati', '', 25, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (109, 'Ceasuri', 'ceasuri', '', 25, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (110, 'Accesorii pentru bărbați', 'accesorii-pentru-barbati', '', 25, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (111, 'Ceasuri pentru bărbați', 'ceasuri-pentru-barbati', '', 25, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (112, 'Haine și accesorii de nuntă', 'haine-si-accesorii-de-nunta', '', 25, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (113, 'Ochelari de soare', 'ochelari-de-soare', '', 25, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (114, 'Alte', 'alte', '', 25, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (115, 'Paltoane și jachete', 'paltoane-si-jachete', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (116, 'Rochii', 'rochii', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (117, 'Topuri și cămăși', 'topuri-si-camasi', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (118, 'Alte îmbrăcăminte pentru femei', 'alte-imbracaminte-pentru-femei', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (119, 'Pulovere și cardigane', 'pulovere-si-cardigane', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (120, 'Pantaloni', 'pantaloni', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (121, 'Blugi', 'blugi', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (122, 'Fuste', 'fuste', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (123, 'Îmbrăcăminte activă', 'imbracaminte-activa', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (124, 'Hanorace și transpirații', 'hanorace-si-transpiratii', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (125, 'Pachete', 'pachete', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (126, 'Costume de baie', 'costume-de-baie', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (127, 'Salopete', 'salopete', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (128, 'Pantaloni scurţi', 'pantaloni-scurti', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (129, 'Tricouri', 'tricouri', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (130, 'Jambiere', 'jambiere', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (131, 'Maternitate', 'maternitate', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (132, 'Costume și croitorie', 'costume-si-croitorie', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (133, 'Veste', 'veste', '', 103, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (134, 'Paltoane și jachete', 'paltoane-si-jachete', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (135, 'Cămăși și topuri casual', 'camasi-si-topuri-casual', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (136, 'Tricouri', 'tricouri', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (137, 'Hanorace și transpirații', 'hanorace-si-transpiratii', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (138, 'Îmbrăcăminte activă', 'imbracaminte-activa', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (139, 'Costume și croitorie', 'costume-si-croitorie', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (140, 'Blugi', 'blugi', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (141, 'Pantaloni', 'pantaloni', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (142, 'Alte îmbrăcăminte pentru bărbați', 'alte-imbracaminte-pentru-barbati', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (143, 'Rochie și costum de epocă', 'rochie-si-costum-de-epoca', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (144, 'Pulovere și cardigane', 'pulovere-si-cardigane', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (145, 'Pantaloni scurţi', 'pantaloni-scurti', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (146, 'Cămăși formale', 'camasi-formale', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (147, 'Pachet de haine', 'pachet-de-haine', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (148, 'Veste', 'veste', '', 104, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (149, 'Cizme', 'cizme', '', 105, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (150, 'Antrenori', 'antrenori', '', 105, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (151, 'Tocuri', 'tocuri', '', 105, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (152, 'Sandale și pantofi de plajă', 'sandale-si-pantofi-de-plaja', '', 105, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (153, 'Apartamente', 'apartamente', '', 105, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (154, 'Papuci', 'papuci', '', 105, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (155, 'Alți pantofi de damă', 'alti-pantofi-de-dama', '', 105, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (156, 'Accesorii pentru încălțăminte', 'accesorii-pentru-incaltaminte', '', 105, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (157, 'Genți de mână pentru femei', 'genti-de-mana-pentru-femei', '', 106, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (158, 'Pălării', 'palarii', '', 106, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (159, 'Eșarfe și șaluri', 'esarfe-si-saluri', '', 106, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (160, 'Poșete și portofele', 'posete-si-portofele', '', 106, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (161, 'Alte accesorii pentru femei', 'alte-accesorii-pentru-femei', '', 106, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (162, 'Curele', 'curele', '', 106, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (163, 'Accesorii pentru păr', 'accesorii-pentru-par', '', 106, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (164, 'Fascinatoare și accesorii pentru cap', 'fascinatoare-si-accesorii-pentru-cap', '', 106, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (165, 'Mănuși', 'manusi', '', 106, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (166, 'Peruci, extensii și accesorii', 'peruci-extensii-si-accesorii', '', 106, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (167, 'Pantofi de sport', 'pantofi-de-sport', '', 108, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (168, 'Cizme pentru', 'cizme-pentru', '', 108, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (169, 'Pantofi casual', 'pantofi-casual', '', 108, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (170, 'Pantofi formali', 'pantofi-formali', '', 108, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (171, 'Alte încălțăminte și ghete', 'alte-incaltaminte-si-ghete', '', 108, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (172, 'Sandale și pantofi de plajă', 'sandale-si-pantofi-de-plaja', '', 108, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (173, 'Papuci', 'papuci', '', 108, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (174, 'Accesorii pentru încălțăminte', 'accesorii-pentru-incaltaminte', '', 108, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (175, 'Pălării și șepci pentru bărbați', 'palarii-si-sepci-pentru-barbati', '', 110, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (176, 'Genți, rucsacuri și ghiozdane pentru bărbați', 'genti-rucsacuri-si-ghiozdane-pentru-barbati', '', 110, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (177, 'Alte accesorii pentru bărbați', 'alte-accesorii-pentru-barbati', '', 110, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (178, 'Portofele pentru bărbați', 'portofele-pentru-barbati', '', 110, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (179, 'Cravate pentru bărbați', 'cravate-pentru-barbati', '', 110, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (180, 'Curele pentru bărbați', 'curele-pentru-barbati', '', 110, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (181, 'Ochelari de soare pentru bărbați', 'ochelari-de-soare-pentru-barbati', '', 110, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (182, 'Mănuși pentru bărbați', 'manusi-pentru-barbati', '', 110, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (183, 'Rochii de mireasă', 'rochii-de-mireasa', '', 112, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (184, 'Rochii de domnișoară de onoare', 'rochii-de-domnisoara-de-onoare', '', 112, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (185, 'Mama miresei', 'mama-miresei', '', 112, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (186, 'Accesorii de mireasă', 'accesorii-de-mireasa', '', 112, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (187, 'Pălării formale și fascinatoare', 'palarii-formale-si-fascinatoare', '', 112, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (188, 'Ținute și costume de mire', 'tinute-si-costume-de-mire', '', 112, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (189, 'Pantofi de mireasă', 'pantofi-de-mireasa', '', 112, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (190, 'Jucării', 'jucarii', '', 26, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (191, 'Haine, pantofi și accesorii pentru copii', 'haine-pantofi-si-accesorii-pentru-copii', '', 26, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (192, 'Mobilier pentru creșă și copii', 'mobilier-pentru-cresa-si-copii', '', 26, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (193, 'Cărucioare', 'carucioare', '', 26, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (194, 'Scaune auto și marsupiu', 'scaune-auto-si-marsupiu', '', 26, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (195, 'Haine pentru copii', 'haine-pentru-copii', '', 26, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (196, 'Jucării de exterior', 'jucarii-de-exterior', '', 26, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (197, 'Balance pentru copii, balansoare și leagăne', 'balance-pentru-copii-balansoare-si-leagane', '', 26, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (198, 'Hrănire', 'hranire', '', 26, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (199, 'Siguranța bebelușilor și copiilor', 'siguranta-bebelusilor-si-copiilor', '', 26, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (200, 'Schimbarea', 'schimbarea', '', 26, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (201, 'Alte', 'alte', '', 26, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (202, 'Pantofi și ghete', 'pantofi-si-ghete', '', 191, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (203, 'Alte haine pentru copii', 'alte-haine-pentru-copii', '', 191, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (204, 'Pachet de haine', 'pachet-de-haine', '', 191, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (205, 'Paltoane și jachete pentru copii', 'paltoane-si-jachete-pentru-copii', '', 191, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (206, 'Topuri și cămăși', 'topuri-si-camasi', '', 191, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (207, 'Rochii', 'rochii', '', 191, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (208, 'Accesorii pentru copii', 'accesorii-pentru-copii', '', 191, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (209, 'Blugi și pantaloni', 'blugi-si-pantaloni', '', 191, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (210, 'Imbracaminte de noapte si pijamale', 'imbracaminte-de-noapte-si-pijamale', '', 191, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (211, 'Costume de baie și costume de baie', 'costume-de-baie-si-costume-de-baie', '', 191, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (212, 'Lămpi, lumini și abajururi', 'lampi-lumini-si-abajururi', '', 192, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (213, 'Pătuțuri și paturi', 'patuturi-si-paturi', '', 192, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (214, 'Mobila pentru cresa', 'mobila-pentru-cresa', '', 192, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (215, 'Pătuțuri și căsuțe', 'patuturi-si-casute', '', 192, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (216, 'Scaune înalte', 'scaune-inalte', '', 192, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (217, 'Căzi de baie', 'cazi-de-baie', '', 192, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (218, 'Depozitare', 'depozitare', '', 192, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (219, 'Mese de schimbare', 'mese-de-schimbare', '', 192, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (220, 'Alte', 'alte', '', 192, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (221, 'Scutere', 'scutere', '', 196, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (222, 'Alte jucării de exterior', 'alte-jucarii-de-exterior', '', 196, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (223, 'Trambuline', 'trambuline', '', 196, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (224, 'Skateboard-uri', 'skateboard-uri', '', 196, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (225, 'Leagăne', 'leagane', '', 196, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (226, 'Căsuțe și corturi de joacă', 'casute-si-corturi-de-joaca', '', 196, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (227, 'Jocuri cu nisip și jucării cu apă', 'jocuri-cu-nisip-si-jucarii-cu-apa', '', 196, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (228, 'Diapozitive', 'diapozitive', '', 196, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (229, 'Baluri pentru copii', 'baluri-pentru-copii', '', 197, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (230, 'Leagăne pentru copii', 'leagane-pentru-copii', '', 197, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (231, 'Baby Rockers', 'baby-rockers', '', 197, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (232, 'Plimbători pentru copii', 'plimbatori-pentru-copii', '', 197, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (233, 'Alte Hranire', 'alte-hranire', '', 198, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (234, 'Pompe de san', 'pompe-de-san', '', 198, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (235, 'Sterilizatoare', 'sterilizatoare', '', 198, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (236, 'Încălzitoare de sticle', 'incalzitoare-de-sticle', '', 198, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (237, 'Sticle', 'sticle', '', 198, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (238, 'Porți și Garzi', 'porti-si-garzi', '', 199, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (239, 'Alte siguranțe pentru bebeluși și copii', 'alte-sigurante-pentru-bebelusi-si-copii', '', 199, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (240, 'Tarcuri', 'tarcuri', '', 199, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (241, 'Bare de pat și apărători', 'bare-de-pat-si-aparatori', '', 199, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (242, 'Monitoare pentru copii', 'monitoare-pentru-copii', '', 199, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (243, 'Olite', 'olite', '', 200, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (244, 'Genți de schimbare', 'genti-de-schimbare', '', 200, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (245, 'Saltele de schimb', 'saltele-de-schimb', '', 200, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (246, 'Alte Schimbări', 'alte-schimbari', '', 200, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (247, 'Biciclete', 'biciclete', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (248, 'Echipament de fitness și gimnastică', 'echipament-de-fitness-si-gimnastica', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (249, 'Echipament de golf', 'echipament-de-golf', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (250, 'Accesorii pentru biciclete', 'accesorii-pentru-biciclete', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (251, 'Sporturi de apă', 'sporturi-de-apa', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (252, 'Camping și drumeții', 'camping-si-drumetii', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (253, 'Bagaje și echipamente de călătorie', 'bagaje-si-echipamente-de-calatorie', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (254, 'Echipament de pescuit', 'echipament-de-pescuit', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (255, 'Echipament sportiv cu minge și rachetă', 'echipament-sportiv-cu-minge-si-racheta', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (256, 'Alte sporturi și agrement', 'alte-sporturi-si-agrement', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (257, 'Sporturi de iarnă', 'sporturi-de-iarna', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (258, 'Patine și skateboard-uri în linie', 'patine-si-skateboard-uri-in-linie', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (259, 'Biciclete electrice', 'biciclete-electrice', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (260, 'Echipament pentru box și arte marțiale', 'echipament-pentru-box-si-arte-martiale', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (261, 'Trotinete electrice', 'trotinete-electrice', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (262, 'Scutere', 'scutere', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (263, 'Abonamente la sală', 'abonamente-la-sala', '', 27, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (264, 'Alte echipamente de fitness și gimnastică', 'alte-echipamente-de-fitness-si-gimnastica', '', 248, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (265, 'Echipament de fitness', 'echipament-de-fitness', '', 248, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (266, 'Greutăți', 'greutati', '', 248, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (267, 'Mașini', 'masini', '', 248, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (268, 'Yoga & Pilates', 'yoga-and-pilates', '', 248, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (269, 'Multi-săli de sport', 'multi-sali-de-sport', '', 248, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (270, 'Biciclete de exercitii', 'biciclete-de-exercitii', '', 265, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (271, 'Benzi de alergare', 'benzi-de-alergare', '', 265, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (272, 'Aparate de vâsle', 'aparate-de-vasle', '', 265, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (273, 'Cross Trainers', 'cross-trainers', '', 265, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (274, 'Antrenori eliptici', 'antrenori-eliptici', '', 265, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (275, 'Plăci de vibrații', 'placi-de-vibratii', '', 265, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (276, 'Gantere', 'gantere', '', 266, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (277, 'Plăci de greutate', 'placi-de-greutate', '', 266, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (278, 'Barbele', 'barbele', '', 266, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (279, 'Seturi', 'seturi', '', 266, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (280, 'Rafturi de depozitare', 'rafturi-de-depozitare', '', 266, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (281, 'Gărzi de podea', 'garzi-de-podea', '', 266, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (282, 'Mașini pentru picioare', 'masini-pentru-picioare', '', 267, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (283, 'Bănci', 'banci', '', 267, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (284, 'Cuști și rafturi de alimentare', 'custi-si-rafturi-de-alimentare', '', 267, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (285, 'Mașini cu cablu', 'masini-cu-cablu', '', 267, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (286, 'Mașini pentru piept și umeri', 'masini-pentru-piept-si-umeri', '', 267, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (287, 'Mașini din spate', 'masini-din-spate', '', 267, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (288, 'Mașini de braț', 'masini-de-brat', '', 267, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (289, 'Mașini de pârghie', 'masini-de-parghie', '', 267, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (290, 'Smith Machines', 'smith-machines', '', 267, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (291, 'Stații VKR/Dip', 'statii-vkr-dip', '', 267, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (292, 'Antrenori cu suspensie', 'antrenori-cu-suspensie', '', 267, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (293, 'Saltele', 'saltele', '', 268, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (294, 'Pilates', 'pilates', '', 268, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (295, 'Benzi elastice', 'benzi-elastice', '', 268, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (296, 'Minge Elvețiană', 'minge-elvetiana', '', 268, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (297, 'Standard', 'standard', '', 269, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (298, 'Compact', 'compact', '', 269, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (299, 'Multi-Stiva', 'multi-stiva', '', 269, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (300, 'Cluburi', 'cluburi', '', 249, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (301, 'Mingi', 'mingi', '', 249, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (302, 'Genți', 'genti', '', 249, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (303, 'Alte echipamente de golf', 'alte-echipamente-de-golf', '', 249, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (304, 'Cărucioare', 'carucioare', '', 249, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (305, 'Seturi', 'seturi', '', 249, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (306, 'Pantofi', 'pantofi', '', 249, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (307, 'Componentele Clubului', 'componentele-clubului', '', 249, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (308, 'Bărci, caiace și jet ski', 'barci-caiace-si-jet-ski', '', 251, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (309, 'Costume de neopină și accesorii', 'costume-de-neopina-si-accesorii', '', 251, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (310, 'Echipament de navigație', 'echipament-de-navigatie', '', 251, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (311, 'Plăci de surf și windsurf', 'placi-de-surf-si-windsurf', '', 251, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (312, 'Echipament de scufundare', 'echipament-de-scufundare', '', 251, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (313, 'Placă cu vâsle', 'placa-cu-vasle', '', 251, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (314, 'Schi nautic și Wakeboard', 'schi-nautic-si-wakeboard', '', 251, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (315, 'Echipament de canotaj', 'echipament-de-canotaj', '', 251, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (316, 'Alte', 'alte', '', 251, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (317, 'Bărci', 'barci', '', 308, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (318, 'Caiace', 'caiace', '', 308, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (319, 'Jet Ski-uri', 'jet-ski-uri', '', 308, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (320, 'Barci de pescuit', 'barci-de-pescuit', '', 308, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (321, 'Echipament de camping', 'echipament-de-camping', '', 252, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (322, 'Corturi', 'corturi', '', 252, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (323, 'Paturi și covoare de camping', 'paturi-si-covoare-de-camping', '', 252, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (324, 'Alte', 'alte', '', 252, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (325, 'Saci de dormit și echipamente', 'saci-de-dormit-si-echipamente', '', 252, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (326, 'Binocluri', 'binocluri', '', 252, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (327, 'Bucătărie', 'bucatarie', '', 252, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (328, 'Îmbrăcăminte și ghete', 'imbracaminte-si-ghete', '', 252, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (329, 'Toalete', 'toalete', '', 252, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (330, 'Valize', 'valize', '', 253, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (331, 'Rucsacuri', 'rucsacuri', '', 253, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (332, 'Cazuri de afaceri', 'cazuri-de-afaceri', '', 253, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (333, 'Genți de sport', 'genti-de-sport', '', 253, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (334, 'Alte', 'alte', '', 253, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (335, 'Bețe', 'bete', '', 254, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (336, 'Mulinete', 'mulinete', '', 254, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (337, 'Naluci și muște', 'naluci-si-muste', '', 254, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (338, 'Combo lansetă și mulinetă', 'combo-lanseta-si-mulineta', '', 254, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (339, 'Scaune de pescuit', 'scaune-de-pescuit', '', 254, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (340, 'Combo și seturi', 'combo-si-seturi', '', 254, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (341, 'Plase', 'plase', '', 254, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (342, 'Waders și ghete', 'waders-si-ghete', '', 254, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (343, 'Păstăi', 'pastai', '', 254, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (344, 'Nailon', 'nailon', '', 254, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (345, 'Alte echipamente de pescuit', 'alte-echipamente-de-pescuit', '', 254, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (346, 'Fotbal', 'fotbal', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (347, 'Tenis, squash și badminton', 'tenis-squash-si-badminton', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (348, 'Cricket', 'cricket', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (349, 'Piscină și snooker', 'piscina-si-snooker', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (350, 'Badminton', 'badminton', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (351, 'Hochei', 'hochei', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (352, 'Boluri', 'boluri', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (353, 'Baschet', 'baschet', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (354, 'Suc de fructe', 'suc-de-fructe', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (355, 'Tenis de masă', 'tenis-de-masa', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (356, 'Rugby', 'rugby', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (357, 'Volei', 'volei', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (358, 'Alte', 'alte', '', 255, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (359, 'Schiuri, bocanci, legături și bețe', 'schiuri-bocanci-legaturi-si-bete', '', 257, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (360, 'Îmbrăcăminte și accesorii', 'imbracaminte-si-accesorii', '', 257, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (361, 'Snowboard, ghete și legături', 'snowboard-ghete-si-legaturi', '', 257, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (362, 'Alte', 'alte', '', 257, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (363, 'Mănuși', 'manusi', '', 260, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (364, 'Saci de box', 'saci-de-box', '', 260, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (365, 'Echipament de protecție', 'echipament-de-protectie', '', 260, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (366, 'Tampoane de lovituri și lovituri', 'tampoane-de-lovituri-si-lovituri', '', 260, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (367, 'Seturi', 'seturi', '', 260, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (368, 'Alte', 'alte', '', 260, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (369, 'Scule electrice', 'scule-electrice', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (370, 'Materiale de constructii', 'materiale-de-constructii', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (371, 'Corpuri de baie', 'corpuri-de-baie', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (372, 'Unelte de mână', 'unelte-de-mana', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (373, 'Uși și ferestre', 'usi-si-ferestre', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (374, 'Instalatii sanitare si incalzire centrala', 'instalatii-sanitare-si-incalzire-centrala', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (375, 'Lemn și cherestea', 'lemn-si-cherestea', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (376, 'Scule electrice de grădină', 'scule-electrice-de-gradina', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (377, 'Scări și camioane de mână', 'scari-si-camioane-de-mana', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (378, 'Depozitare scule și bancuri de lucru', 'depozitare-scule-si-bancuri-de-lucru', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (379, 'Șuruburi și fixare', 'suruburi-si-fixare', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (380, 'Îmbrăcăminte de protecție și îmbrăcăminte de lucru', 'imbracaminte-de-protectie-si-imbracaminte-de-lucru', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (381, 'Unelte de mână pentru grădină', 'unelte-de-mana-pentru-gradina', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (382, 'Traverse de cale ferată', 'traverse-de-cale-ferata', '', 28, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (383, 'Alte scule electrice', 'alte-scule-electrice', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (384, 'Burghie', 'burghie', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (385, 'Ferăstraie', 'ferastraie', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (386, 'Râșnițe', 'rasnite', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (387, 'Generatoare', 'generatoare', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (388, 'Echipamente de sudare', 'echipamente-de-sudare', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (389, 'Sanders', 'sanders', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (390, 'Cuietoare și capsatoare', 'cuietoare-si-capsatoare', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (391, 'Routere', 'routere', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (392, 'Compresoare de aer', 'compresoare-de-aer', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (393, 'Strunguri', 'strunguri', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (394, 'Betoniere', 'betoniere', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (395, 'Rindele', 'rindele', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (396, 'Seturi de scule electrice', 'seturi-de-scule-electrice', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (397, 'Șurubelnițe electrice', 'surubelnite-electrice', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (398, 'Taietori de faiantă', 'taietori-de-faianta', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (399, 'Echipament de lipit', 'echipament-de-lipit', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (400, 'Pistoale cu aer cald', 'pistoale-cu-aer-cald', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (401, 'Slefuitoare', 'slefuitoare', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (402, 'Truse combinate', 'truse-combinate', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (403, 'Aspiratoare umede uscate', 'aspiratoare-umede-uscate', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (404, 'Ciocane rotative', 'ciocane-rotative', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (405, 'Pompe de apă', 'pompe-de-apa', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (406, 'Tâmplarie', 'tamplarie', '', 369, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (407, 'Alte materiale de constructii', 'alte-materiale-de-constructii', '', 370, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (408, 'Acoperiș și ventilație', 'acoperis-si-ventilatie', '', 370, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (409, 'Placi ceramice', 'placi-ceramice', '', 370, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (410, 'Cărămizi, blocuri și buiandrugi', 'caramizi-blocuri-si-buiandrugi', '', 370, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (411, 'Izolare', 'izolare', '', 370, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (412, 'Jgheab și drenaj', 'jgheab-si-drenaj', '', 370, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (413, 'Materiale de tablă', 'materiale-de-tabla', '', 370, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (414, 'Ciment, mortar și agregate', 'ciment-mortar-si-agregate', '', 370, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (415, 'Gips-carton și gips-carton', 'gips-carton-si-gips-carton', '', 370, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (416, 'Produse chimice pentru constructii', 'produse-chimice-pentru-constructii', '', 370, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (417, 'Chiuvete și bazine', 'chiuvete-si-bazine', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (418, 'Baterii și baterii pentru baie', 'baterii-si-baterii-pentru-baie', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (419, 'Corpuri de duș', 'corpuri-de-dus', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (420, 'Toalete, Scaune WC și Bideuri', 'toalete-scaune-wc-si-bideuri', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (421, 'Dulapuri și depozitare', 'dulapuri-si-depozitare', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (422, 'Placi', 'placi', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (423, 'Radiatoare prosoape', 'radiatoare-prosoape', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (424, 'Alte accesorii pentru baie', 'alte-accesorii-pentru-baie', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (425, 'Paravane de duș de baie', 'paravane-de-dus-de-baie', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (426, 'Suite de baie', 'suite-de-baie', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (427, 'Panouri de baie', 'panouri-de-baie', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (428, 'Rafturi', 'rafturi', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (429, 'Unități', 'unitati', '', 371, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (430, 'Alte unelte de mână', 'alte-unelte-de-mana', '', 372, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (431, 'Chei', 'chei', '', 372, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (432, 'Cleme și menghine', 'cleme-si-menghine', '', 372, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (433, 'Seturi și truse de scule de mână', 'seturi-si-truse-de-scule-de-mana', '', 372, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (434, 'Ferăstraie', 'ferastraie', '', 372, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (435, 'Dalte', 'dalte', '', 372, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (436, 'Șurubelnițe', 'surubelnite', '', 372, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (437, 'Ciocane', 'ciocane', '', 372, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (438, 'Instrumente pentru zidărie și gresie', 'instrumente-pentru-zidarie-si-gresie', '', 372, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (439, 'Slefuit, Scrubs & Perii', 'slefuit-scrubs-and-perii', '', 372, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (440, 'Mașini de tuns iarba', 'masini-de-tuns-iarba', '', 376, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (441, 'Mașini de spălat cu presiune', 'masini-de-spalat-cu-presiune', '', 376, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (442, 'Mașini de tuns gard viu', 'masini-de-tuns-gard-viu', '', 376, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (443, 'Drujbe', 'drujbe', '', 376, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (444, 'Suflatoare de frunze și aspiratoare', 'suflatoare-de-frunze-si-aspiratoare', '', 376, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (445, 'Alte scule electrice de grădină', 'alte-scule-electrice-de-gradina', '', 376, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (446, 'Tocatoare de gradina', 'tocatoare-de-gradina', '', 376, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (447, 'Pompe și accesorii pentru iaz', 'pompe-si-accesorii-pentru-iaz', '', 376, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (448, 'Alte unelte de mână pentru grădină', 'alte-unelte-de-mana-pentru-gradina', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (449, 'Lopeți', 'lopeti', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (450, 'Roabe și cărucioare', 'roabe-si-carucioare', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (451, 'Greble și sape', 'greble-si-sape', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (452, 'Foarfece și tăietori', 'foarfece-si-taietori', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (453, 'Furci', 'furci', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (454, 'Furtunuri și tambururi pentru furtun', 'furtunuri-si-tambururi-pentru-furtun', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (455, 'Focatoare și tundere', 'focatoare-si-tundere', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (456, 'Instrumente pentru plivitul', 'instrumente-pentru-plivitul', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (457, 'Jardiniere', 'jardiniere', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (458, 'Compostere și pubele', 'compostere-si-pubele', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (459, 'Seturi de instrumente', 'seturi-de-instrumente', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (460, 'Mănuși, cărucioare și accesorii', 'manusi-carucioare-si-accesorii', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (461, 'Mistrie, plutitoare și șoimi', 'mistrie-plutitoare-si-soimi', '', 381, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (462, 'Cărți, benzi desenate și reviste', 'carti-benzi-desenate-si-reviste', '', 30, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (463, 'Muzică', 'muzica', '', 30, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (464, 'Filme și TV', 'filme-si-tv', '', 30, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (465, 'Jocuri și jocuri de societate', 'jocuri-si-jocuri-de-societate', '', 30, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (466, 'Altă muzică, filme, cărți și jocuri', 'alta-muzica-filme-carti-si-jocuri', '', 30, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (467, 'Cărți', 'carti', '', 462, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (468, 'Reviste', 'reviste', '', 462, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (469, 'Benzi desenate', 'benzi-desenate', '', 462, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (470, 'Cărți audio', 'carti-audio', '', 462, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (471, 'Alte cărți, benzi desenate și reviste', 'alte-carti-benzi-desenate-si-reviste', '', 462, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (472, 'Vinil', 'vinil', '', 463, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (473, 'CD-uri', 'cd-uri', '', 463, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (474, 'Casete', 'casete', '', 463, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (475, 'Altă muzică', 'alta-muzica', '', 463, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (476, 'DVD-uri', 'dvd-uri', '', 464, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (477, 'Casete VHS', 'casete-vhs', '', 464, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (478, 'Blu-ray-uri', 'blu-ray-uri', '', 464, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (479, 'Electrocasnice', 'electrocasnice', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (480, 'Aparate Mici', 'aparate-mici', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (481, 'Cuptoare, Plite și Plite', 'cuptoare-plite-si-plite', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (482, 'Frigidere Congelatoare', 'frigidere-congelatoare', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (483, 'Mașini de spălat', 'masini-de-spalat', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (484, 'Uscătoare de rufe', 'uscatoare-de-rufe', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (485, 'Alte Aparate', 'alte-aparate', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (486, 'Aparate pentru sănătate și frumusețe', 'aparate-pentru-sanatate-si-frumusete', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (487, 'Frigidere', 'frigidere', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (488, 'Mașini de spălat vase', 'masini-de-spalat-vase', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (489, 'Congelatoare', 'congelatoare', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (490, 'Mașină de spălat uscător', 'masina-de-spalat-uscator', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (491, 'Aparate integrate', 'aparate-integrate', '', 31, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (492, 'Încălzire, incendii și împrejurimi', 'incalzire-incendii-si-imprejurimi', '', 479, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (493, 'Aspiratoare', 'aspiratoare', '', 479, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (494, 'Aer condiționat și ventilatoare de vânzare', 'aer-conditionat-si-ventilatoare-de-vanzare', '', 479, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (495, 'Alte Electrocasnice', 'alte-electrocasnice', '', 479, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (496, 'Fiare de călcat și mese de călcat', 'fiare-de-calcat-si-mese-de-calcat', '', 479, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (497, 'Purificatoare de aer și dezumidificatoare', 'purificatoare-de-aer-si-dezumidificatoare', '', 479, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (498, 'Aparate de cafea', 'aparate-de-cafea', '', 480, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (499, 'Fierbătoare și prăjitoare de pâine', 'fierbatoare-si-prajitoare-de-paine', '', 480, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (500, 'Friteuze', 'friteuze', '', 480, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (501, 'Blendere, procesoare și mixere', 'blendere-procesoare-si-mixere', '', 480, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (502, 'Cuptoare cu microunde', 'cuptoare-cu-microunde', '', 480, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (503, 'Producători de alimente și băuturi', 'producatori-de-alimente-si-bauturi', '', 480, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (504, 'Prepararea băuturii reci', 'prepararea-bauturii-reci', '', 480, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (505, 'Alte electrocasnice mici', 'alte-electrocasnice-mici', '', 480, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (506, 'Aragazele lente', 'aragazele-lente', '', 480, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (507, 'Gratare de sanatate', 'gratare-de-sanatate', '', 480, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (508, 'Masini de paine', 'masini-de-paine', '', 480, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (509, 'Aragazele de orez', 'aragazele-de-orez', '', 480, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (510, 'Storcatoare', 'storcatoare', '', 504, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (511, 'Producători de băuturi', 'producatori-de-bauturi', '', 504, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (512, 'Filtre și cartușe de apă', 'filtre-si-cartuse-de-apa', '', 504, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (513, 'Alte Cuptoare, Plite și Plite', 'alte-cuptoare-plite-si-plite', '', 481, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (514, 'Plite de gătit', 'plite-de-gatit', '', 481, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (515, 'Plite', 'plite', '', 481, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (516, 'Hote și splashbacks', 'hote-si-splashbacks', '', 481, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (517, 'Aparate de îngrijire și coafare a părului', 'aparate-de-ingrijire-si-coafare-a-parului', '', 486, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (518, 'Aparate pentru epilare și epilare cu ceară', 'aparate-pentru-epilare-si-epilare-cu-ceara', '', 486, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (519, 'Aparate de ingrijire dentara', 'aparate-de-ingrijire-dentara', '', 486, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (520, 'Aparate de masaj și relaxare', 'aparate-de-masaj-si-relaxare', '', 486, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (521, 'Calculatoare, laptopuri și netbook-uri', 'calculatoare-laptopuri-si-netbook-uri', '', 32, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (522, 'Software', 'software', '', 32, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (523, 'Laptop-uri și netbook-uri PC', 'laptop-uri-si-netbook-uri-pc', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (524, 'PC-uri desktop și stații de lucru', 'pc-uri-desktop-si-statii-de-lucru', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (525, 'Monitoare și proiectoare', 'monitoare-si-proiectoare', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (526, 'Tablete, cărți electronice și cititoare electronice', 'tablete-carti-electronice-si-cititoare-electronice', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (527, 'Imprimante și scanere', 'imprimante-si-scanere', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (528, 'Laptop-uri Apple', 'laptop-uri-apple', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (529, 'Accesorii pentru laptop', 'accesorii-pentru-laptop', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (530, 'Tastaturi, mouse și dispozitive de intrare', 'tastaturi-mouse-si-dispozitive-de-intrare', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (531, 'Modemuri, bandă largă și rețele', 'modemuri-banda-larga-si-retele', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (532, 'Hard disk-uri și unități externe', 'hard-disk-uri-si-unitati-externe', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (533, 'Memorie, placi de baza si procesoare', 'memorie-placi-de-baza-si-procesoare', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (534, 'Plăci video și plăci de sunet', 'placi-video-si-placi-de-sunet', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (535, 'Accesorii pentru tablete, cărți electronice și eReader', 'accesorii-pentru-tablete-carti-electronice-si-ereader', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (536, 'Servere', 'servere', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (537, 'PDA-uri, dispozitive portabile și accesorii', 'pda-uri-dispozitive-portabile-si-accesorii', '', 521, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (538, 'Alte programe software', 'alte-programe-software', '', 522, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (539, 'Sisteme de operare', 'sisteme-de-operare', '', 522, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (540, 'Birou și afaceri', 'birou-si-afaceri', '', 522, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (541, 'Editare imagini, video și audio', 'editare-imagini-video-si-audio', '', 522, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (542, 'Software antivirus', 'software-antivirus', '', 522, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (543, 'Telefoane mobile', 'telefoane-mobile', '', 33, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (544, 'Accesorii pentru telefoane mobile', 'accesorii-pentru-telefoane-mobile', '', 33, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (545, 'Telefoane de acasă și robote telefonice', 'telefoane-de-acasa-si-robote-telefonice', '', 33, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (546, 'Ceas inteligent', 'ceas-inteligent', '', 33, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (547, 'Echipamente de comunicații radio', 'echipamente-de-comunicatii-radio', '', 33, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (548, 'Cartele SIM', 'cartele-sim', '', 33, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (549, 'Apple iPhone', 'apple-iphone', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (550, 'Samsung', 'samsung', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (551, 'Alte', 'alte', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (552, 'Nokia', 'nokia', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (553, 'Motorola', 'motorola', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (554, 'Sony Ericsson', 'sony-ericsson', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (555, 'Mur', 'mur', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (556, 'HTC', 'htc', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (557, 'LG', 'lg', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (558, 'Vodafone', 'vodafone', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (559, 'Siemens', 'siemens', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (560, 'O2, XDA', 'o2-xda', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (561, 'Portocale', 'portocale', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (562, 'T-Mobile, MDA', 't-mobile-mda', '', 543, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (563, 'Carcase și huse', 'carcase-si-huse', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (564, 'Încărcătoare și andocuri', 'incarcatoare-si-andocuri', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (565, 'Căști', 'casti', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (566, 'Cabluri și adaptoare', 'cabluri-si-adaptoare', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (567, 'Alte accesorii', 'alte-accesorii', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (568, 'Protectoare de ecran', 'protectoare-de-ecran', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (569, 'Suporturi și monturi', 'suporturi-si-monturi', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (570, 'Baterii', 'baterii', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (571, 'Carduri de memorie', 'carduri-de-memorie', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (572, 'Pachete de accesorii', 'pachete-de-accesorii', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (573, 'Docuri și difuzoare audio', 'docuri-si-difuzoare-audio', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (574, 'Stilouri', 'stilouri', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (575, 'Difuzoare auto', 'difuzoare-auto', '', 544, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (576, 'Alte telefoane și accesorii', 'alte-telefoane-si-accesorii', '', 545, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (577, 'Robot telefonic', 'robot-telefonic', '', 545, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (578, 'Cabluri și adaptoare', 'cabluri-si-adaptoare', '', 545, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (579, 'Prize de telefon', 'prize-de-telefon', '', 545, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (580, 'Baterii', 'baterii', '', 545, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (581, 'Radio de amatori/amatori', 'radio-de-amatori-amatori', '', 547, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (582, 'Walkie Talkie', 'walkie-talkie', '', 547, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (583, 'Radiouri CB', 'radiouri-cb', '', 547, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (584, 'Antene', 'antene', '', 547, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (585, 'Alte echipamente radio', 'alte-echipamente-radio', '', 547, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (586, 'Piese și accesorii', 'piese-si-accesorii', '', 547, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (587, 'Mobilitate, dizabilitate și medicale', 'mobilitate-dizabilitate-si-medicale', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (588, 'Îngrijirea părului și coafarea', 'ingrijirea-parului-si-coafarea', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (589, 'Parfumuri', 'parfumuri', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (590, 'Machiaj și cosmetice', 'machiaj-si-cosmetice', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (591, 'Sănătate', 'sanatate', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (592, 'Produse de masaj', 'produse-de-masaj', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (593, 'Baie și corp', 'baie-si-corp', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (594, 'Îngrijirea tenului facial', 'ingrijirea-tenului-facial', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (595, 'Bărbierit și îndepărtare a părului', 'barbierit-si-indepartare-a-parului', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (596, 'Manichiura & Pedichiura', 'manichiura-and-pedichiura', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (597, 'Vitamine și suplimente', 'vitamine-si-suplimente', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (598, 'Îngrijire solară și bronzare', 'ingrijire-solara-si-bronzare', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (599, 'Dieta si pierderea in greutate', 'dieta-si-pierderea-in-greutate', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (600, 'Îngrijire dentară', 'ingrijire-dentara', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (601, 'Tatuaj și artă corporală', 'tatuaj-si-arta-corporala', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (602, 'Îngrijirea vederii și a ochilor', 'ingrijirea-vederii-si-a-ochilor', '', 34, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (603, 'Mobilier de birou', 'mobilier-de-birou', '', 35, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (604, 'Echipamente pentru restaurante și catering', 'echipamente-pentru-restaurante-si-catering', '', 35, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (605, 'Rechizite, Echipamente și Papetarie', 'rechizite-echipamente-si-papetarie', '', 35, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (606, 'Accesorii de vânzare cu amănuntul și magazine', 'accesorii-de-vanzare-cu-amanuntul-si-magazine', '', 35, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (607, 'Rechizite pentru ambalare și corespondență', 'rechizite-pentru-ambalare-si-corespondenta', '', 35, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (608, 'Afaceri De Vanzare', 'afaceri-de-vanzare', '', 35, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (609, 'Echipamente medicale și de laborator', 'echipamente-medicale-si-de-laborator', '', 35, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (610, 'Remorcă de catering', 'remorca-de-catering', '', 35, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (611, 'Birouri și Mese', 'birouri-si-mese', '', 603, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (612, 'Scaune', 'scaune', '', 603, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (613, 'Dulapuri de depozitare și clasare', 'dulapuri-de-depozitare-si-clasare', '', 603, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (614, 'Rafturi de cărți', 'rafturi-de-carti', '', 603, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (615, 'Alte Mobilier', 'alte-mobilier', '', 603, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (616, 'Cabine și compartimentări', 'cabine-si-compartimentari', '', 603, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (617, 'Rechizite și echipamente de birou', 'rechizite-si-echipamente-de-birou', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (618, 'Cartușe de cerneală și toner', 'cartuse-de-cerneala-si-toner', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (619, 'Imprimante', 'imprimante', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (620, 'Alte echipamente de birou', 'alte-echipamente-de-birou', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (621, 'Calculatoare', 'calculatoare', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (622, 'Tocatoare', 'tocatoare', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (623, 'Flipchart și table albe', 'flipchart-si-table-albe', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (624, 'Capsatoare', 'capsatoare', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (625, 'Faxuri', 'faxuri', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (626, 'Scanere și copiatoare', 'scanere-si-copiatoare', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (627, 'Marcatori de etichete', 'marcatori-de-etichete', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (628, 'Covorașe pentru mouse și suport pentru încheietura mâinii', 'covorase-pentru-mouse-si-suport-pentru-incheietura-mainii', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (629, 'Proiectoare', 'proiectoare', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (630, 'Scanere', 'scanere', '', 605, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (631, 'Case de marcat și consumabile', 'case-de-marcat-si-consumabile', '', 606, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (632, 'Raft și rafturi', 'raft-si-rafturi', '', 606, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (633, 'Manechine', 'manechine', '', 606, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (634, 'Display de vânzare cu amănuntul', 'display-de-vanzare-cu-amanuntul', '', 606, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (635, 'Alte accesorii pentru magazine și magazine', 'alte-accesorii-pentru-magazine-si-magazine', '', 606, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (636, 'Publicitate și semne pentru magazine', 'publicitate-si-semne-pentru-magazine', '', 606, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (637, 'Semne', 'semne', '', 606, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (638, 'Plicuri', 'plicuri', '', 607, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (639, 'Cutii', 'cutii', '', 607, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (640, 'Alte consumabile pentru ambalare și corespondență', 'alte-consumabile-pentru-ambalare-si-corespondenta', '', 607, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (641, 'Banda de ambalare', 'banda-de-ambalare', '', 607, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (642, 'Folie cu bule și spumă', 'folie-cu-bule-si-spuma', '', 607, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (643, 'Saci, pungi și saci de corespondență', 'saci-pungi-si-saci-de-corespondenta', '', 607, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (644, 'Etichete de adresă', 'etichete-de-adresa', '', 607, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (645, 'Pungi de hârtie și pungi Guipt', 'pungi-de-hartie-si-pungi-guipt', '', 607, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (646, 'Chitare și accesorii', 'chitare-si-accesorii', '', 36, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (647, 'Claviaturi și piane', 'claviaturi-si-piane', '', 36, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (648, 'Percuție și tobe', 'percutie-si-tobe', '', 36, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (649, 'Echipamente de studio și muzică live', 'echipamente-de-studio-si-muzica-live', '', 36, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (650, 'Echipamente de performanță și DJ', 'echipamente-de-performanta-si-dj', '', 36, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (651, 'Instrumente muzicale cu coarde', 'instrumente-muzicale-cu-coarde', '', 36, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (652, 'Instrumente muzicale de suflat', 'instrumente-muzicale-de-suflat', '', 36, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (653, 'Partituri și cărți de cântece', 'partituri-si-carti-de-cantece', '', 36, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (654, 'Instrumente muzicale din alamă', 'instrumente-muzicale-din-alama', '', 36, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (655, 'Alte', 'alte', '', 36, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (656, 'Chitare', 'chitare', '', 646, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (657, 'Alte chitare și accesorii', 'alte-chitare-si-accesorii', '', 646, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (658, 'Amplificatoare de bas', 'amplificatoare-de-bas', '', 646, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (659, 'Piese', 'piese', '', 646, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (660, 'Efecte de bas', 'efecte-de-bas', '', 646, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (661, 'Coarde', 'coarde', '', 646, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (662, 'Curele', 'curele', '', 646, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (663, 'Claviaturi electrice', 'claviaturi-electrice', '', 647, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (664, 'Pianine', 'pianine', '', 647, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (665, 'Acordeene', 'acordeene', '', 647, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (666, 'Alte tastaturi, piane, organe și accesorii', 'alte-tastaturi-piane-organe-si-accesorii', '', 647, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (667, 'Organe', 'organe', '', 647, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (668, 'Suporturi pentru claviaturi', 'suporturi-pentru-claviaturi', '', 647, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (669, 'Huse', 'huse', '', 647, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (670, 'Scaune pentru pian', 'scaune-pentru-pian', '', 647, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (671, 'Tobe', 'tobe', '', 648, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (672, 'Cimbale', 'cimbale', '', 648, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (673, 'Alte Percuții și Tobe', 'alte-percutii-si-tobe', '', 648, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (674, 'Suporturi și feronerie pentru tobe', 'suporturi-si-feronerie-pentru-tobe', '', 648, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (675, 'Pedale de tobe', 'pedale-de-tobe', '', 648, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (676, 'Genți și cutii', 'genti-si-cutii', '', 648, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (677, 'Suporturi pentru tobe', 'suporturi-pentru-tobe', '', 648, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (678, 'Tobe și piei', 'tobe-si-piei', '', 648, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (679, 'Bețișoare de tobă', 'betisoare-de-toba', '', 648, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (680, 'Xilofoane și Glockenspiels', 'xilofoane-si-glockenspiels', '', 648, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (681, 'Tamburinele', 'tamburinele', '', 648, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (682, 'Difuzoare și monitoare', 'difuzoare-si-monitoare', '', 649, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (683, 'Alte echipamente de studio', 'alte-echipamente-de-studio', '', 649, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (684, 'Sintetizatoare', 'sintetizatoare', '', 649, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (685, 'Efecte', 'efecte', '', 649, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (686, 'Interfețe audio/MIDI', 'interfete-audio-midi', '', 649, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (687, 'Controlere audio/MIDI', 'controlere-audio-midi', '', 649, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (688, 'Recordere', 'recordere', '', 649, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (689, 'Samplere și secvențiere', 'samplere-si-secventiere', '', 649, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (690, 'Standuri și suporturi', 'standuri-si-suporturi', '', 649, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (691, 'Aparate cu tobe', 'aparate-cu-tobe', '', 649, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (692, 'Preamplificatoare', 'preamplificatoare', '', 649, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (693, 'Piese și accesorii', 'piese-si-accesorii', '', 649, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (694, 'Decuri', 'decuri', '', 650, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (695, 'Alte echipamente și accesorii DJ', 'alte-echipamente-si-accesorii-dj', '', 650, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (696, 'Iluminări și efecte de scenă', 'iluminari-si-efecte-de-scena', '', 650, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (697, 'Mixere', 'mixere', '', 650, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (698, 'Echipament Karaoke', 'echipament-karaoke', '', 650, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (699, 'Standuri și suporturi', 'standuri-si-suporturi', '', 650, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (700, 'Piese și accesorii', 'piese-si-accesorii', '', 650, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (701, 'Saxofon', 'saxofon', '', 652, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (702, 'Flaut', 'flaut', '', 652, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (703, 'Clarinet', 'clarinet', '', 652, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (704, 'Cimpoiele', 'cimpoiele', '', 652, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (705, 'Oboi', 'oboi', '', 652, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (706, 'Alte instrumente de suflat și accesorii', 'alte-instrumente-de-suflat-si-accesorii', '', 652, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (707, 'Trâmbiţă', 'trambita', '', 654, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (708, 'Trombon', 'trombon', '', 654, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (709, 'Alte instrumente de alamă', 'alte-instrumente-de-alama', '', 654, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (710, 'Accesorii pentru instrumente din alamă', 'accesorii-pentru-instrumente-din-alama', '', 654, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (711, 'Cornet', 'cornet', '', 654, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (712, 'Televizoare, televizoare cu plasmă și LCD', 'televizoare-televizoare-cu-plasma-si-lcd', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (713, 'Accesorii TV, DVD și VCR', 'accesorii-tv-dvd-si-vcr', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (714, 'Smart TV', 'smart-tv', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (715, 'Alte televizoare, DVD și video', 'alte-televizoare-dvd-si-video', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (716, 'Playere și recordere DVD', 'playere-si-recordere-dvd', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (717, 'Recepție TV și set-top boxes', 'receptie-tv-si-set-top-boxes', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (718, 'Echipamente prin satelit și cablu', 'echipamente-prin-satelit-si-cablu', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (719, 'Sisteme de securitate și supraveghere', 'sisteme-de-securitate-si-supraveghere', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (720, 'Proiectoare TV', 'proiectoare-tv', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (721, 'Playere și recordere Blu-ray', 'playere-si-recordere-blu-ray', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (722, 'Playere și recordere video', 'playere-si-recordere-video', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (723, 'Dispozitive GPS', 'dispozitive-gps', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (724, 'Playere portabile DVD și Blu-ray', 'playere-portabile-dvd-si-blu-ray', '', 37, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (725, 'Suporturi și suporturi TV', 'suporturi-si-suporturi-tv', '', 713, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (726, 'Cabluri și conectori', 'cabluri-si-conectori', '', 713, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (727, 'Telecomenzi', 'telecomenzi', '', 713, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (728, 'Alte accesorii TV și DVD', 'alte-accesorii-tv-si-dvd', '', 713, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (729, 'Ochelari și accesorii TV 3D', 'ochelari-si-accesorii-tv-3d', '', 713, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (730, 'Stereo și accesorii', 'stereo-si-accesorii', '', 38, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (731, 'Stereouri personale', 'stereouri-personale', '', 38, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (732, 'Alte stereo și audio', 'alte-stereo-si-audio', '', 38, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (733, 'Home Cinema', 'home-cinema', '', 38, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (734, 'Microfoane', 'microfoane', '', 38, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (735, 'Difuzoare', 'difuzoare', '', 730, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (736, 'Sisteme stereo (întregi)', 'sisteme-stereo-intregi', '', 730, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (737, 'Amperi', 'amperi', '', 730, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (738, 'Radiouri', 'radiouri', '', 730, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (739, 'CD, casetă și radio (separate)', 'cd-caseta-si-radio-separate', '', 730, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (740, 'Playere de discuri/plate turnante', 'playere-de-discuri-plate-turnante', '', 730, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (741, 'Stereo compacte', 'stereo-compacte', '', 730, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (742, 'Alte', 'alte', '', 730, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (743, 'Căști', 'casti', '', 731, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (744, 'iPod-uri', 'ipod-uri', '', 731, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (745, 'Playere MP3', 'playere-mp3', '', 731, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (746, 'Minidisc și Discman', 'minidisc-si-discman', '', 731, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (747, 'Jocuri', 'jocuri', '', 39, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (748, 'Console', 'console', '', 39, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (749, 'Accesorii pentru jocuri video', 'accesorii-pentru-jocuri-video', '', 39, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (750, 'Alte jocuri video și console', 'alte-jocuri-video-si-console', '', 39, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (751, 'Marfa de jocuri', 'marfa-de-jocuri', '', 39, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (752, 'Piese de schimb și unelte', 'piese-de-schimb-si-unelte', '', 39, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (753, 'PS4 (Sony Playstation 4)', 'ps4-sony-playstation-4', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (754, 'Xbox One', 'xbox-one', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (755, 'Alte console', 'alte-console', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (756, 'PS5 (Sony PlayStation 5)', 'ps5-sony-playstation-5', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (757, 'Xbox 360 și Xbox', 'xbox-360-si-xbox', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (758, 'Nintendo Wii', 'nintendo-wii', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (759, 'PS2 și PS1 (Sony PlayStation 2 și 1)', 'ps2-si-ps1-sony-playstation-2-si-1', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (760, 'PS3 (Sony PlayStation 3)', 'ps3-sony-playstation-3', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (761, 'Nintendo DS și DSi', 'nintendo-ds-si-dsi', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (762, 'Sega', 'sega', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (763, 'PSP (Sony PlayStation Portable)', 'psp-sony-playstation-portable', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (764, 'Nintendo 3DS', 'nintendo-3ds', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (765, 'PS Vita (Sony Playstation Vita)', 'ps-vita-sony-playstation-vita', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (766, 'Atari', 'atari', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (767, 'Nintendo Wii U', 'nintendo-wii-u', '', 748, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (768, 'Controlere pentru jocuri video', 'controlere-pentru-jocuri-video', '', 749, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (769, 'Alte accesorii pentru jocuri video', 'alte-accesorii-pentru-jocuri-video', '', 749, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (770, 'Pachete de accesorii pentru jocuri video', 'pachete-de-accesorii-pentru-jocuri-video', '', 749, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (771, 'Cabluri și adaptoare pentru jocuri video', 'cabluri-si-adaptoare-pentru-jocuri-video', '', 749, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (772, 'Carcase, huse și genți pentru jocuri video', 'carcase-huse-si-genti-pentru-jocuri-video', '', 749, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (773, 'Jocuri video Senzori de mișcare și camere', 'jocuri-video-senzori-de-miscare-si-camere', '', 749, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (774, 'Camere digitale', 'camere-digitale', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (775, 'Alte camere și accesorii', 'alte-camere-si-accesorii', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (776, 'Camere de supraveghere', 'camere-de-supraveghere', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (777, 'Lentile', 'lentile', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (778, 'Trepiede și suporturi', 'trepiede-si-suporturi', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (779, 'Accesorii pentru aparate foto', 'accesorii-pentru-aparate-foto', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (780, 'Camere de film și de unică folosință', 'camere-de-film-si-de-unica-folosinta', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (781, 'Iluminat și studio', 'iluminat-si-studio', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (782, 'Camere video și camere video', 'camere-video-si-camere-video', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (783, 'Binoclu și lunete', 'binoclu-si-lunete', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (784, 'Telescoape', 'telescoape', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (785, 'Pistoale și accesorii', 'pistoale-si-accesorii', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (786, 'Filtre', 'filtre', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (787, 'Rame foto digitale', 'rame-foto-digitale', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (788, 'Piese de schimb și unelte', 'piese-de-schimb-si-unelte', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (789, 'Prinderi', 'prinderi', '', 40, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (790, 'Alte accesorii pentru aparate foto', 'alte-accesorii-pentru-aparate-foto', '', 779, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (791, 'Huse, Genți și Huse', 'huse-genti-si-huse', '', 779, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (792, 'Carduri de memorie și cititoare', 'carduri-de-memorie-si-cititoare', '', 779, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (793, 'Baterii', 'baterii', '', 779, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (794, 'Cabluri și adaptoare', 'cabluri-si-adaptoare', '', 779, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (795, 'Încărcătoare și andocuri', 'incarcatoare-si-andocuri', '', 779, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (796, 'Pachete de accesorii', 'pachete-de-accesorii', '', 779, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (797, 'Diverse', 'diverse', '', 44, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (798, 'Gospodărie', 'gospodarie', '', 44, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (799, 'Calculatoare și telefoane', 'calculatoare-si-telefoane', '', 44, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (800, 'Audio și viziune', 'audio-si-viziune', '', 44, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (801, 'Sport și agrement', 'sport-si-agrement', '', 44, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (802, 'Transport', 'transport', '', 44, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (803, 'Concerte', 'concerte', '', 45, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (804, 'Comedie și teatru', 'comedie-si-teatru', '', 45, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (805, 'Days Out', 'days-out', '', 45, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (806, 'Sport', 'sport', '', 45, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (807, 'Voiaj', 'voiaj', '', 45, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (808, 'De inchiriat', 'de-inchiriat', '', 3, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (809, 'Pentru a distribui', 'pentru-a-distribui', '', 3, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (810, 'De vânzare', 'de-vanzare', '', 3, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (811, 'Comercial', 'comercial', '', 3, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (812, 'Garaje pentru parcare', 'garaj-pentru-parcare', '', 3, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (813, 'Pentru a schimba', 'pentru-a-schimba', '', 3, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (814, 'Se caută proprietate', 'se-cauta-proprietate', '', 3, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (815, 'Închirieri de vacanță', 'inchirieri-de-vacanta', '', 3, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (816, 'Internaţional', 'international', '', 3, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (817, 'De Închiriat', 'de-inchiriat', '', 811, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (818, 'De vânzare', 'de-vanzare', '', 811, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (819, 'De inchiriat', 'de-inchiriat', '', 812, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (820, 'De vânzare', 'de-vanzare', '', 812, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (821, 'Predare și educație', 'predare-si-educatie', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (822, 'Transport, Logistica & Livrare', 'transport-logistica-and-livrare', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (823, 'Inginerie', 'inginerie', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (824, 'Producție și industrie', 'productie-si-industrie', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (825, 'Asistență medicală și medicină', 'asistenta-medicala-si-medicin', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (826, 'Vânzări', 'vanzari', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (827, 'Serviciu Clienți și Call Center', 'serviciu-clienti-si-call-center', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (828, 'Construcții și proprietate', 'constructii-si-proprietate', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (829, 'Agricultura', 'agricultura', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (830, 'Comerț cu amănuntul', 'comert-cu-amanuntul', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (831, 'Menaj și curățenie', 'menaj-si-curatenie', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (832, 'Contabilitate', 'contabilitate', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (833, 'Servicii financiare', 'servicii-financiare', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (834, 'Administrator și Secretariat', 'administrator-si-secretariat', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (835, 'Recrutare', 'recrutare', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (836, 'Securitate', 'securitate', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (837, 'HR', 'hr', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (838, 'Ospitalitate și catering', 'ospitalitate-si-catering', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (839, 'Îngrijirea copilului', 'ingrijirea-copilului', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (840, 'Muncă socială și de îngrijire', 'munca-sociala-si-de-ingrijire', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (841, 'Marketing, Publicitate și PR', 'marketing-publicitate-si-pr', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (842, 'Legal', 'legal', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (843, 'Caritate', 'caritate', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (844, 'Sănătate și frumusețe', 'sanatate-si-frumusete', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (845, 'Conducere și automobile', 'conducere-si-automobile', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (846, 'Media, Digital și Creative', 'media-digital-si-creative', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (847, 'Agrement & Turism', 'agrement-and-turism', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (848, 'Calculatoare și IT', 'calculatoare-si-it', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (849, 'Grădinărit', 'gradinarit', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (850, 'Artele spectacolului', 'artele-spectacolului', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (851, 'Animale', 'animale', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (852, 'Sport, fitness și agrement', 'sport-fitness-si-agrement', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (853, 'Artă și patrimoniu', 'arta-si-patrimoniu', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (854, 'Achiziții și achiziții', 'achizitii-si-achizitii', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (855, 'Științific și Cercetare', 'stiintific-si-cercetare', '', 4, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (856, 'Meserii și construcții', 'meserii-si-constructii', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (857, 'Sănătate și frumusețe', 'sanatate-si-frumusete', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (858, 'Cursuri și cursuri', 'cursuri-si-cursuri', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (859, 'Transport', 'transport', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (860, 'Proprietate și întreținere', 'proprietate-si-intretinere', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (861, 'Automobilism', 'automobilism', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (862, 'Nunti', 'nunti', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (863, 'Afaceri și birouri', 'afaceri-si-birouri', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (864, 'Finanțe și juridic', 'finante-si-juridic', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (865, 'Divertisment', 'divertisment', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (866, 'Calculatoare și telecomunicații', 'calculatoare-si-telecomunicatii', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (867, 'Animale de companie', 'animale-de-companie', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (868, 'Îngrijirea copiilor', 'ingrijirea-copiilor', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (869, 'Îmbrăcăminte', 'imbracaminte', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (870, 'Mâncare și băutură', 'mancare-si-bautura', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (871, 'Furnizori și comercianți cu amănuntul de bunuri', 'furnizori-si-comercianti-cu-amanuntul-de-bunuri', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (872, 'Călătorii și turism', 'calatorii-si-turism', '', 5, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (873, 'Servicii de îndepărtare', 'servicii-de-indepartare', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (874, 'Mântuitorii', 'mantuitorii', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (875, 'Instalatii sanitare', 'instalatii-sanitare', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (876, 'Pictură și decorare', 'pictura-si-decorare', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (877, 'Constructorii', 'constructorii', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (878, 'Electricieni', 'electricieni', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (879, 'Grădinărit și amenajare a teritoriului', 'gradinarit-si-amenajare-a-teritoriului', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (880, 'Tâmplarie', 'tamplarie', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (881, 'Tencuieli', 'tencuieli', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (882, 'Controlul dăunătorilor și paraziților', 'controlul-daunatorilor-si-parazitilor', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (883, 'Lăcătuși', 'lacatusi', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (884, 'Pardoseală', 'pardoseala', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (885, 'Gresierii', 'gresierii', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (886, 'Montatori de baie', 'montatori-de-baie', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (887, 'Acoperișuri', 'acoperisuri', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (888, 'Arhitect', 'arhitect', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (889, 'Lucrătorii pământului', 'lucratorii-pamantului', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (890, 'Montatori de bucatarii', 'montatori-de-bucatarii', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (891, 'Asamblatori de mobilă și pachete plate', 'asamblatori-de-mobila-si-pachete-plate', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (892, 'Zidari', 'zidari', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (893, 'Chirurgii arborilor', 'chirurgii-arborilor', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (894, 'Schele', 'schele', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (895, 'Aer condiționat și încălzire', 'aer-conditionat-si-incalzire', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (896, 'Antreprenori de garduri', 'antreprenori-de-garduri', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (897, 'Pavaj și Alee', 'pavaj-si-alee', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (898, 'Ferestre și uși', 'ferestre-si-usi', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (899, 'Montatori dormitoare', 'montatori-dormitoare', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (900, 'Specialiști în conversie la mansardă', 'specialisti-in-conversie-la-mansarda', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (901, 'Salt de închiriere', 'salt-de-inchiriere', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (902, 'Pietrarii', 'pietrarii', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (903, 'Montatori de magazine', 'montatori-de-magazine', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (904, 'Ingineri Structurali', 'ingineri-structurali', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (905, 'Supraveghetori', 'supraveghetori', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (906, 'Fierarii', 'fierarii', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (907, 'Curători de coșuri', 'curatori-de-cosuri', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (908, 'Mutări peste mări', 'mutari-peste-mari', '', 856, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (909, 'Masaje', 'masaje', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (910, 'Coafura', 'coafura', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (911, 'Tratamente de frumusețe', 'tratamente-de-frumusete', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (912, 'Terapii alternative', 'terapii-alternative', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (913, 'Antrenori personali', 'antrenori-personali', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (914, 'Alte servicii de sănătate și frumusețe', 'alte-servicii-de-sanatate-si-frumusete', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (915, 'Make Up Artisti', 'make-up-artisti', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (916, 'Nursing & Care', 'nursing-and-care', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (917, 'Coaching de viață', 'coaching-de-viata', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (918, 'Modele și Actori', 'modele-si-actori', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (919, 'Tatuaj și piercing', 'tatuaj-si-piercing', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (920, 'Medici și clinici', 'medici-si-clinici', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (921, 'Podologi și podologi', 'podologi-si-podologi', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (922, 'Stomatologi', 'stomatologi', '', 857, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (923, 'Academic', 'academic', '', 858, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (924, 'Limbă', 'limba', '', 858, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (925, 'Lecții de șofat și instructori', 'lectii-de-sofat-si-instructori', '', 858, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (926, 'Muzică', 'muzica', '', 858, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (927, 'Alte clase', 'alte-clase', '', 858, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (928, 'Constructii', 'constructii', '', 858, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (929, 'IT & Computing', 'it-and-computing', '', 858, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (930, 'Sănătate și fitness', 'sanatate-si-fitness', '', 858, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (931, 'Arte și meșteșuguri', 'arte-si-mestesuguri', '', 858, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (932, 'Afaceri', 'afaceri', '', 858, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (933, 'Închirieri auto', 'inchirieri-auto', '', 859, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (934, 'Închiriere furgonete și camioane', 'inchiriere-furgonete-si-camioane', '', 859, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (935, 'Taxi', 'taxi', '', 859, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (936, 'Închiriere șofer și limuzine', 'inchiriere-sofer-si-limuzine', '', 859, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (937, 'Închiriere de vehicule', 'inchiriere-de-vehicule', '', 859, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (938, 'Autobuz și autocar', 'autobuz-si-autocar', '', 859, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (939, 'Curățători', 'curatatori', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (940, 'Servicii de întreținere a proprietății', 'servicii-de-intretinere-a-proprietatii', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (941, 'Alte servicii de proprietate și întreținere', 'alte-servicii-de-proprietate-si-intretinere', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (942, 'Menajere', 'menajere', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (943, 'Designeri de interior', 'designeri-de-interior', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (944, 'Satelit, antenă și TV', 'satelit-antena-si-tv', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (945, 'Curățarea canalizării și a conductelor', 'curatarea-canalizarii-si-a-conductelor', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (946, 'Agenti imobiliari', 'agenti-imobiliari', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (947, 'Consultanți imobiliari', 'consultanti-imobiliari', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (948, 'Servicii de securitate', 'servicii-de-securitate', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (949, 'Agenți de închiriere', 'agenti-de-inchiriere', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (950, 'Agenți de proprietate comercială', 'agenti-de-proprietate-comerciala', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (951, 'Reparații TV', 'reparatii-tv', '', 860, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (952, 'Servicii de recuperare a vehiculelor', 'servicii-de-recuperare-a-vehiculelor', '', 861, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (953, 'Service și reparații auto', 'service-si-reparatii-auto', '', 861, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (954, 'Alte Servicii Auto', 'alte-servicii-auto', '', 861, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (955, 'Servicii de garaj și mecanică', 'servicii-de-garaj-si-mecanica', '', 861, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (956, 'Repararea caroseriei', 'repararea-caroseriei', '', 861, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (957, 'Valeting auto', 'valeting-auto', '', 861, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (958, 'Montare anvelope', 'montare-anvelope', '', 861, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (959, 'Spărgătoare de mașini', 'spargatoare-de-masini', '', 861, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (960, 'Fotografie și film', 'fotografie-si-film', '', 862, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (961, 'Alte Servicii de nunta', 'alte-servicii-de-nunta', '', 862, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (962, 'Mașini și transport', 'masini-si-transport', '', 862, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (963, 'Închiriere Marquee', 'inchiriere-marquee', '', 862, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (964, 'Catering și servicii', 'catering-si-servicii', '', 862, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (965, 'Organizatori și planificatori', 'organizatori-si-planificatori', '', 862, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (966, 'Divertisment', 'divertisment', '', 862, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (967, 'Frizerii', 'frizerii', '', 862, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (968, 'Locuri de nuntă și recepție', 'locuri-de-nunta-si-receptie', '', 862, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (969, 'Contabilitate', 'contabilitate', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (970, 'Alte servicii de afaceri și birou', 'alte-servicii-de-afaceri-si-birou', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (971, 'Depozitare', 'depozitare', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (972, 'Scriere și literatură', 'scriere-si-literatura', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (973, 'Servicii generale de birou', 'servicii-generale-de-birou', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (974, 'Marketing', 'marketing', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (975, 'Servicii de secretariat', 'servicii-de-secretariat', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (976, 'Servicii de curierat', 'servicii-de-curierat', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (977, 'Sănătate și siguranță', 'sanatate-si-siguranta', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (978, 'Agentii de publicitate', 'agentii-de-publicitate', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (979, 'Distribuire pliante', 'distribuire-pliante', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (980, 'Transport', 'transport', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (981, 'Interpretare și traducere', 'interpretare-si-traducere', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (982, 'Recrutare', 'recrutare', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (983, 'Imprimare', 'imprimare', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (984, 'Angro', 'angro', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (985, 'Creatori de semne', 'creatori-de-semne', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (986, 'Cercetare de piata', 'cercetare-de-piata', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (987, 'Afaceri de peste mări', 'afaceri-de-peste-mari', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (988, 'Servicii de mărunțire', 'servicii-de-maruntire', '', 863, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (989, 'Brokeri ipotecare', 'brokeri-ipotecare', '', 864, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (990, 'Sfaturi financiare', 'sfaturi-financiare', '', 864, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (991, 'Servicii juridice', 'servicii-juridice', '', 864, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (992, 'Viză și imigrare', 'viza-si-imigrare', '', 864, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (993, 'Avocați și transferuri', 'avocati-si-transferuri', '', 864, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (994, 'Astrologie și psihic', 'astrologie-si-psihic', '', 865, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (995, 'Închiriere DJ și discotecă', 'inchiriere-dj-si-discoteca', '', 865, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (996, 'Alte servicii de divertisment', 'alte-servicii-de-divertisment', '', 865, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (997, 'Animatori', 'animatori', '', 865, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (998, 'Trupe și muzicieni', 'trupe-si-muzicieni', '', 865, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (999, 'Catering', 'catering', '', 865, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1000, 'Săli de evenimente și facilități pentru banchete', 'sali-de-evenimente-si-facilitati-pentru-banchete', '', 865, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1001, 'Locuri și cluburi de noapte', 'locuri-si-cluburi-de-noapte', '', 865, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1002, 'Producători de prăjituri', 'producatori-de-prajituri', '', 865, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1003, 'Design site', 'design-site', '', 866, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1004, 'Reparatii calculatoare', 'reparatii-calculatoare', '', 866, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1005, 'Servicii Web', 'servicii-web', '', 866, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1006, 'Dezvoltare Web', 'dezvoltare-web', '', 866, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1007, 'Dezvoltare de aplicații software', 'dezvoltare-de-aplicatii-software', '', 866, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1008, 'Servicii informatice', 'servicii-informatice', '', 866, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1009, 'Suport computer', 'suport-computer', '', 866, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1010, 'Reparatii telefon si tablete', 'reparatii-telefon-si-tablete', '', 866, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1011, 'Furnizori de conținut online', 'furnizori-de-continut-online', '', 866, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1012, 'Alte servicii informatice', 'alte-servicii-informatice', '', 866, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1013, 'Furnizori de servicii de telecomunicații și internet', 'furnizori-de-servicii-de-telecomunicatii-si-internet', '', 866, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1014, 'Rețea de calculatoare', 'retea-de-calculatoare', '', 866, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1015, 'Petsitter și câini', 'petsitter-si-caini', '', 867, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1016, 'Veterinari', 'veterinari', '', 867, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1017, 'Îngrijire', 'ingrijire', '', 867, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1018, 'Antrenament', 'antrenament', '', 867, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1019, 'Babysitting', 'babysitting', '', 868, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1020, 'Bonele', 'bonele', '', 868, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1021, 'Ingrijitoarele de copii', 'ingrijitoarele-de-copii', '', 868, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1022, 'Alte servicii pentru copii', 'alte-servicii-pentru-copii', '', 868, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1023, 'Sprijin pentru părinți', 'sprijin-pentru-parinti', '', 868, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1024, 'Au pairs', 'au-pairs', '', 868, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1025, 'Croitoreasă și Croiitoare', 'croitoreasa-si-croiitoare', '', 869, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1026, 'Curățătorie chimică și spălătorie', 'curatatorie-chimica-si-spalatorie', '', 869, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1027, 'Creatori de modă', 'creatori-de-moda', '', 869, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1028, 'Stilisti', 'stilisti', '', 869, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1029, 'Alte alimente și băuturi', 'alte-alimente-si-bauturi', '', 870, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1030, 'La pachet', 'la-pachet', '', 870, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1031, 'Restaurante', 'restaurante', '', 870, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1032, 'Cafenele', 'cafenele', '', 870, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1033, 'Brutărie', 'brutarie', '', 870, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1034, 'Baruri și Pub-uri', 'baruri-si-pub-uri', '', 870, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1035, 'Furnizori și comercianți cu amănuntul de alte bunuri', 'furnizori-si-comercianti-cu-amanuntul-de-alte-bunuri', '', 871, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1036, 'Accesorii', 'accesorii', '', 871, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1037, 'Magazine de haine', 'magazine-de-haine', '', 871, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1038, 'Electric', 'electric', '', 871, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1039, 'Bijutieri', 'bijutieri', '', 871, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1040, 'Europa', 'europa', '', 872, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1041, 'Agenții de turism', 'agentii-de-turism', '', 872, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1042, 'Restul lumii', 'restul-lumii', '', 872, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1043, 'Închiriere rulote', 'inchiriere-rulote', '', 872, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1044, 'Hostel & Hoteluri', 'hostel-and-hoteluri', '', 872, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1045, 'Marea Britanie și Irlanda', 'marea-britanie-si-irlanda', '', 872, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1046, 'Echipe sportive și parteneri', 'echipe-sportive-si-parteneri', '', 6, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1047, 'Evenimente, concerte și viață de noapte', 'evenimente-concerte-si-viata-de-noapte', '', 6, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1048, 'Clasele', 'clasele', '', 6, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1049, 'Muzică, trupe și muzicieni', 'muzica-trupe-si-muzicieni', '', 6, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1050, 'Grupuri și asociații', 'grupuri-si-asociatii', '', 6, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1051, 'Artiști și teatre', 'artisti-si-teatre', '', 6, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1052, 'Schimb de abilități și limbă', 'schimb-de-abilitati-si-limba', '', 6, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1053, 'Travel & Travel Partners', 'travel-and-travel-partners', '', 6, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1054, 'Lucruri pierdute și găsite', 'lucruri-pierdute-si-gasite', '', 6, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1055, 'Rideshare și mașină în comun', 'rideshare-si-masina-in-comun', '', 6, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1056, 'Păsări', 'pasari', '', 7, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1057, 'Pisici', 'pisici', '', 7, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1058, 'Câini', 'caini', '', 7, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1059, 'Echipamente și accesorii', 'echipamente-si-accesorii', '', 7, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1060, 'Exotice', 'exotice', '', 7, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1061, 'Peşte', 'peste', '', 7, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1062, 'Cai și ponei', 'cai-si-ponei', '', 7, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1063, 'Dispărut, pierdut și găsit', 'disparut-pierdut-si-gasit', '', 7, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1064, 'Animale de companie de vânzare', 'animale-de-companie-de-vanzare', '', 7, 0, true, false);
INSERT INTO public.categories (id, name, slug, description, parent, sort, pricing, hidden) VALUES (1065, 'Mici blanuri', 'mici-blanuri', '', 7, 0, true, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 1065, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories_hidden_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_hidden_index ON public.categories USING btree (hidden);


--
-- Name: categories_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_name_index ON public.categories USING btree (lower((name)::text));


--
-- Name: categories_parent_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_parent_index ON public.categories USING btree (parent);


--
-- Name: categories_slug_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_slug_index ON public.categories USING btree (lower((slug)::text));


--
-- Name: categories_sort_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_sort_index ON public.categories USING btree (sort);


--
-- Name: idx_unique_category; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_category ON public.categories USING btree (name, slug, COALESCE(parent, '-1'::integer));


--
-- Name: categories fk_parent_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT fk_parent_category FOREIGN KEY (parent) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--
