CREATE TABLE visitor_message (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    tag_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_visitor_message_tag
        FOREIGN KEY (tag_token)
        REFERENCES tags(tag_token)
        ON DELETE CASCADE
);

CREATE INDEX idx_visitor_message_tag_token
    ON visitor_message(tag_token);