CREATE OR REPLACE FUNCTION ad_promotion_index(
    bid_amount DOUBLE PRECISION,
    from_date TIMESTAMP,
    to_date TIMESTAMP,
    lambda DOUBLE PRECISION DEFAULT 0.01
) RETURNS DOUBLE PRECISION AS $$
DECLARE
    duration DOUBLE PRECISION;
    time_decay DOUBLE PRECISION;
    pi DOUBLE PRECISION;
BEGIN
    -- Calculate duration in days (avoid division by zero)
    duration := EXTRACT(EPOCH FROM (to_date - from_date)) / 86400;
    IF duration <= 0 THEN
        RETURN 0;
    END IF;

    -- Time decay factor (older ads have lower priority)
    time_decay := EXP(-lambda * EXTRACT(EPOCH FROM (NOW() - from_date)) / 86400);

    -- Calculate Promotion Index
    pi := (bid_amount / duration) * time_decay;

    RETURN pi;
END;
$$ LANGUAGE plpgsql;
