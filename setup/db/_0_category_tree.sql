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