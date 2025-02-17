CREATE TABLE events (
    "uuid" UUID,
    "kind" TEXT NOT NULL,
    "user" INTEGER,
    "metadata" JSONB,
    "ip" INET,
    "agent" TEXT,
    "time" TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY ("uuid", "user", "time")
);

CREATE INDEX idx_kind ON events ("kind");
CREATE INDEX idx_user_event_time ON events ("user", "time" DESC);

SELECT create_hypertable('events', 'time', partitioning_column => 'user', number_partitions => 100);
