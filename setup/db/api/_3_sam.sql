create table resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL
);

create table sam (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER references users(id),
    "resource_id" INTEGER references resources(id),
    "permission" INT,
    UNIQUE(user_id, resource_id, permission)
);

-- todo: use a different table for roles sam_users, sam_roles?

CREATE INDEX sam_index ON sam (user_id,resource_id,permission);

insert into resources values 
    (1, 'cities', 'platform'),
    (2, 'props', 'platform'),
    (3, 'categories', 'platform'),
    (4, 'ad', 'content');

-- Read = 1 (binary 0001)
-- Write = 2 (binary 0010)
-- Publish = 4 (binary 0100)
-- Delete = 8 (binary 1000)

insert into sam values 
    (1, 2, 1, 1|2|4|8), -- allow me edit cities
    (2, 2, 2, 1|2|4|8), -- allow me edit props
    (3, 2, 3, 1|2|4|8), -- allow me edit categories
    (4, 2, 4, 1|2|4|8); -- allow me edit ads