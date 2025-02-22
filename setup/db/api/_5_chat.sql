create table chats (
    "id" serial not null primary key,
    "title" varchar(255) not null,
    "context" varchar(16),
    "reference" integer,
    "participants" integer[] not null,
    "archived" integer[] not null,
    "deleted" integer[] not null,
    "created_at" timestamp not null default current_timestamp
);

CREATE UNIQUE INDEX unique_chat ON chats ("context", "reference", "participants");
CREATE INDEX idx_chat_participants ON chats USING gin ("participants");

create table messages (
    "id" serial not null primary key,
    "chat" integer not null references chats(id) ON DELETE CASCADE,
    "from" integer not null references users(id),
    "message" text not null,
    "seen" json,
    "created_at" timestamp not null default current_timestamp
);

CREATE INDEX idx_messages_chat ON messages("chat");